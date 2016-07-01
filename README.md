# Social Customer Care [![Build Status](https://travis-ci.org/watson-developer-cloud/social-customer-care.svg?branch=master)](https://travis-ci.org/watson-developer-cloud/social-customer-care)

This application is a Starter Kit (SK) that is designed to get you up and running quickly with a common industry pattern, and to provide information and best practices around Watson services. This application was created to demonstrate how the [Natural Language Classifier][natural-language-classifier] can be used to direct customer requests and queries to the appropriate agent or workflow. Additionally, [Tone Analyzer][tone-analyzer], [Alchemy Language][alchemy-language], and [Personality Insights][personality-insights] demonstrate how to efficiently provide an agent with customer insights.

Give it a try! Click the button below to fork into IBM DevOps Services and deploy your own copy of this application on Bluemix.

[![Deploy to Bluemix](https://bluemix.net/deploy/button.png)](https://github.com/watson-developer-cloud/social-customer-care)

You can see a version of this app that is already running by clicking here.

**IMPORTANT:**
1. This application requires an AlchemyAPI key with high transaction limits. The free AlchemyAPI key that you request has a limit of 1000 transactions per day, which is insufficient for significant use of this sample application. See [step 3](#step3) of the [Getting Started](#getting-started) section for information about requesting a higher transaction limit on your sample AlchemyAPI key.

2. Running the application will require twitter credentials to access the twitter stream. These credentials can be created at [apps.twitter.com][dev-twitter]. These must be provided in the `.env.js` file.

3. The Natural Language Classifier requires training prior prior to running the application.

## Table of Contents
 - [Getting Started](#gettings-started)
 - [Running the application locally](#Running the Application Locally)
 - [About the Social Customer Care pattern](#About the Social Customer Care pattern)
 - [Troubleshooting](#Troubleshooting)

## Getting Started

  The application written in [Node.js](http://nodejs.org/) and uses [npm](https://www.npmjs.com/). Instructions for downloading and installing these are included in the following procedure.

1. Log into GitHub and fork the project repository. Clone your fork to a folder on your local system and change to that folder.
2. Create a Bluemix Account. [Sign up][sign_up] in Bluemix, or use an existing account. Watson Beta or Experimental Services are free to use.
3. If it is not already installed on your system, download and install the [Cloud-foundry CLI][cloud_foundry] tool.
4. If it is not already installed on your system, install [Node.js](http://nodejs.org/). Installing Node.js will also install the npm command. Make sure to use node version 4.2.1 as specified in `package.json` or you may run into problems like installation issues.
5. Edit the `manifest.yml` file in the folder that contains your fork and replace `application-name` with a unique name for your copy of the application. The name that you specify determines the application's URL, such as `application-name.mybluemix.net`. The relevant portion of the `manifest.yml` file looks like the following:
```yml
declared-services:
  natural-language-classifier-service:
    label: natural_language_classifier
    plan: standard
  personality-insights-service:
    label: personality_insights
    plan: tiered
  tone-analyzer-standard:
    label: tone_analyzer
    plan: standard
applications:
  - services:
    - natural-language-classifier-service
    - personality-insights-service
    - tone-analyzer-standard
  name: social-customer-care
  command: npm start
  path: .
  memory: 512M
```
6. Connect to Blumix by running the following commands in a terminal window:
```sh
$ cf api https://api.ng.bluemix.net
$ cf login -u <your-Bluemix-ID> -p <your-Bluemix-password>
```
7. Create instances of the required Watson services.
  - Create an instance of the [Natural Language Classifier][natural-language-classifier] service by running the following command:
  ```sh
  $ cf create-service natural_language_classifier standard classifier-service
  ```
  **Note:** You will see a message that states "Attention: The plan standard of `service natural_language_classifier` is not free. The instance classifier-service will incur a cost. Contact your administrator if you think this is in error.". The first Natural Language Classifier instance that you create is free under the standard plan, so there will be no change if you only create a single classifier instance for use by this application.

  - If you already have an Alchemy Language service you will use those credentials. Othwerise, create an instance of the [Alchemy Language][alchemy-language] service by running the following command:
  ```sh
  $ cf create-service alchemy_api free alchemy-language-service
  ```
  **Note:** The free plan of alchemy api has a limit of 1000 API calls a day. This is only sufficient to run quick tests of the starter kit but not fully support the application. The standard plan is not limited w

  - Create an instance of the [Personality Insights][personality-insights] service by running the following command:
  ```sh
  $ cf create-service personality_insights tiered personality-insights-service
  ```
  **Note:** You will see a message that states "Attention: The plan `tiered` of service `personality_insights` is not free.  The instance `personality-insights-service` will incur a cost.  Contact your administrator if you think this is in error." The first 100 API calls each month are free, so if you remain under this limit there will be no charge.

  - Create an instance of the Tone Analyzer service by running the following command:
  ```sh
  $ cf create-service tone_analyzer standard tone-analyzer-service
  ```
  **Note:** You will see a message that states "Attention: The plan `standard` of service `tone_analyzer` is not free.  The instance `tone-analyzer-service` will incur a cost.  Contact your administrator if you think this is in error." The first 1000 API calls each month are free, so if you remain under this limit there will be no charge.

8. Sign up at [apps.twitter.com][dev-twitter] for application credentials. Create a new application with the `Create new app` button and fill out the required form.

9. The Natural Language Classifier requires training prior to using the application. The training data is provided in `data/classifier-training-data.csv`. Adapt the following curl command to train your classifier (replace the username and password with the service credentials of the Natural Language Classifier created in the last step):
```
curl -u "{username}":"{password}" -F training_data=@classifier-training-data.csv -F training_metadata="{\"language\":\"en\",\"name\":\"My Classifier\"}" "https://gateway.watsonplatform.net/natural-language-classifier/api/v1/classifiers"
```

10. Provide the credentials to the application by creating a `.env.js` file using this format:
```node
module.exports = {
  TWITTER: JSON.stringify([{
    consumer_key: 'consumer_key',
    consumer_secret: 'consumer_secret',
    access_token_key: 'access_token_key',
    access_token_secret: 'access_token_secret'
  }]),
  TWITTER_TOPIC: '@support',
  CLASSIFIER_ID: ' CLASSIFIER ID',
  ALCHEMY_API_KEY: 'ALCHEMY KEY',
  DEBUG: 'scc:*'
};
```

11. Push the updated application live by running the following command:
```sh
$ cf push
```

## Running locally
First, make sure that you followed steps 1 through 9 in the [previous section](#Getting Started) and that you are still logged in to Bluemix.

1. Expand the  `.env.js` file created previously in the root directory of the project with the following content (the template is provided in the `env.js` file):
```node
module.exports = {
  VCAP_SERVICES: JSON.stringify({
   natural_language_classifier: [{
     credentials: {
       url: 'https://gateway.watsonplatform.net/natural-language-classifier/api',
       username: 'USERNAME',
       password: 'PASSWORD'
     }
   }],
   tone_analyzer: [{
     credentials: {
       url: 'https://gateway.watsonplatform.net/tone-analyzer/api',
       username: 'USERNAME',
       password: 'PASSWORD'
     }
   }],
   personality_insights: [{
     credentials: {
       url: 'https://gateway.watsonplatform.net/personality-insights/api',
       username: 'USERNAME',
       password: 'PASSWORD'
     }
   }]
  }),
  TWITTER: JSON.stringify([{
    consumer_key: 'consumer_key',
    consumer_secret: 'consumer_secret',
    access_token_key: 'access_token_key',
    access_token_secret: 'access_token_secret'
  }]),
  TWITTER_TOPIC: '@support',
  CLASSIFIER_ID: ' CLASSIFIER ID',
  ALCHEMY_API_KEY: 'ALCHEMY KEY',
  DEBUG: 'scc:*'
};
```
2. Copy the `username`, `password`, `apikey`, and `url` credentials from your `alchemy-language-service`, `classifier-service`, `tone-analyzer-service`, and `personality-insights-service` services in Bluemix to the previous file. To see the service credentials for each of your service instance run the following command, replacing `<application-name>` with the name of the application that you specified in your `manifest.yml` file:
```sh
$ cf env <application-name>
```
3. Install any dependencies that a local version of your application requires:
```
$ npm install
```
4. Install Gulp globally if not already installed:
```
$ npm install -g gulp
```
5. Start the application by running:
```
$ gulp
```
6. Open http://localhost:3000 to see the running application.

## About the Social Customer Care pattern
For a given input, a trained Natural Language Classifier responds with a list of intent classes and a confidence score. A frequent use case is to use the user intent and confidence scores to determine how best to assist a customer. This pattern can be used to send customers to an appropriate agent, to respond to commonly asked questions, and to begin the appropriate dialog conversation as is done with the [Conversational Agent](https://github.com/watson-developer-cloud/conversational-agent-application-starter-kit) Starter Kit. This Starter Kit demonstrates the basic approach of how the Natural Language Classifier can be easily used to improve customer support.

To demonstrate this approach, the Starter Kit uses a live stream of the tweets being sent to [Twitter's @Support](https://twitter.com/Support) account. These tweets are sent to a trained Natural Language Classifier. The resulting intents and confidence scores are used to delegate the tweets or provide a potential response.

The results of Tone Analyzer, Alchemy Language, and Personality Insights services are used to provide quick insight into the customer. Tone Analyzer is used to determine the current mood of the user based on their tweet. Alchemy Language and Personality Insights are ran on each the customer's past tweets. The entity and keyword extraction of Alchemy Language provides a quick snapshot of the topics that the customer typically tweets about and Personality Insights determines provides an estimate of the customer's personality. This information can be used to provide an agent with quick insight into their customer or even to help send a customer to the most appropriate agent (ex. avoid sending irate customers to a new agent).

**Note**: For the purposes of this starter kit, random bodies of text are substituted for the customer's past tweets. This is done to avoid the issues involved with retrieving past at scale. For your application, past tweets can be easily retrieved by using the [IBM Insights for Twitter](https://console.ng.bluemix.net/docs/services/Twitter/index.html#twitter) Service available on Bluemix.

## Reference information
The following links provide more information about the Natural Language Classifier, Tone Analyzer, Alchemy Language, and Personality Insights services.

### Natural Language Classifier
  * [API documentation](http://www.ibm.com/smarterplanet/us/en/ibmwatson/developercloud/doc/nl-classifier/): Get an in-depth knowledge of the Natural Language Classifier service
  * [API reference](http://www.ibm.com/smarterplanet/us/en/ibmwatson/developercloud/natural-language-classifier/api/v1/): SDK code examples and reference
  * [API Explorer](https://watson-api-explorer.mybluemix.net/apis/natural-language-classifier-v1): Try out the API
  * [Creating your own classifier](http://www.ibm.com/smarterplanet/us/en/ibmwatson/developercloud/doc/nl-classifier/get_start.shtml): How to use the API to create and use your own classifier

### Tone Analyzer
  * [API documentation](http://www.ibm.com/smarterplanet/us/en/ibmwatson/developercloud/doc/tone-analyzer/): Get an in-depth knowledge of the Natural Language Classifier service
  * [API reference](http://www.ibm.com/smarterplanet/us/en/ibmwatson/developercloud/tone-analyzer/api/v1/): SDK code examples and reference
  * [API explorer](http://www.ibm.com/smarterplanet/us/en/ibmwatson/developercloud/apis/tone-analyzer-apis.html): Try out the REST API

### AlchemyAPI
  * [API documentation](http://www.alchemyapi.com/api): Get an in-depth understanding of the AlchemyAPI services
  * [AlchemyData News reference](http://docs.alchemyapi.com/): API and query gallery

### Personality Insights
  * [API documentation](http://www.ibm.com/smarterplanet/us/en/ibmwatson/developercloud/doc/personality-insights/): Get an in-depth understanding of the Personality Insights services
  * [API reference](http://www.ibm.com/smarterplanet/us/en/ibmwatson/developercloud/personality-insights/api/v2/): SDK code examples and reference
  * [API explorerer](https://watson-api-explorer.mybluemix.net/apis/personality-insights-v2): Try out the REST API

## Troubleshooting

To troubleshoot your Bluemix application, use the logs. To see the logs, run:

  ```sh
  $ cf logs <application-name> --recent
  ```

## License

  This sample code is licensed under Apache 2.0. Full license text is available in [LICENSE](LICENSE).

## Contributing

  See [CONTRIBUTING](CONTRIBUTING.md).

## Open Source @ IBM

  Find more open source projects on the [IBM Github Page](http://ibm.github.io/)

### Privacy Notice

This node sample web application includes code to track deployments to Bluemix and other Cloud Foundry platforms. The following information is sent to a [Deployment Tracker][deploy_track_url] service on each deployment:

* Application Name (`application_name`)
* Space ID (`space_id`)
* Application Version (`application_version`)
* Application URIs (`application_uris`)

This data is collected from the `VCAP_APPLICATION` environment variable in IBM Bluemix and other Cloud Foundry platforms. This data is used by IBM to track metrics around deployments of sample applications to IBM Bluemix. Only deployments of sample applications that include code to ping the Deployment Tracker service will be tracked.

### Disabling Deployment Tracking

Deployment tracking can be disabled by removing `require('cf-deployment-tracker-client').track();` from the beginning of the `server.js` file at the root of this repo.

[deploy_track_url]: https://github.com/cloudant-labs/deployment-tracker
[cloud_foundry]: https://github.com/cloudfoundry/cli
[sign_up]: https://console.ng.bluemix.net/registration/
[get-alchemyapi-key]: https://console.ng.bluemix.net/catalog/services/alchemyapi/

[tone-analyzer]: http://www.ibm.com/smarterplanet/us/en/ibmwatson/developercloud/tone-analyzer.html
[alchemy-language]: http://www.ibm.com/smarterplanet/us/en/ibmwatson/developercloud/alchemy-language.html
[natural-language-classifier]: http://www.ibm.com/smarterplanet/us/en/ibmwatson/developercloud/nl-classifier.html
[personality-insights]:http://www.ibm.com/smarterplanet/us/en/ibmwatson/developercloud/personality-insights.html
[dev-twitter]: http://apps.twitter.com
