# <%= bluemix.name -%> [![](https://img.shields.io/badge/bluemix-powered-blue.svg)](https://bluemix.net)

This application is a Starter Kit (SK) that is designed to get you up and running quickly with a common industry pattern, and to provide information and best practices around Watson services. This application was created to demonstrate how the [Natural Language Classifier][natural-language-classifier] can be used to direct customer requests and queries to the appropriate agent or workflow. Additionally, [Tone Analyzer][tone-analyzer], [Natural Language Understanding][natural-language-understanding], and [Personality Insights][personality-insights] demonstrate how to efficiently provide an agent with customer insights.

You can see a version of this app that is already running [here](https://social-customer-care.mybluemix.net/).

## Getting Started

### Training Watson

1. The Natural Language Classifier requires training prior to using the application. The training data is provided in `data/classifier-training-data.csv`. Run the following command:

```sh
npm run train
```

1. Sign up at [dev-twitter](http://apps.twitter.com) for application credentials. Create a new application with the `Create new app` button and fill out the required form.

1. Update `env.properties` with the credentials for your Twitter application.

```s
TWITTER_CONSUMER_KEY=REPLACE WITH YOUR CONSUMER KEY
TWITTER_CONSUMER_SECRET=REPLACE WITH YOUR CONSUMER SECRET
TWITTER_ACCESS_TOKEN_KEY=REPLACE WITH YOUR ACCESS TOKEN KEY
TWITTER_ACCESS_TOKEN_SECRET=REPLACE WITH YOUR ACCESS TOKEN SECRET
```

### Run locally as Node.js application


```sh
npm install
npm run build
npm start
```

### Run locally in Docker container

```sh
bx plugin install dev -r Bluemix
bx dev run
```

### Deploy to Bluemix as CloudFoundry application

```sh
cf push
```

### Deploy to Bluemix automatically

[![Deploy to Bluemix](https://bluemix.net/deploy/button.png)](https://bluemix.net/deploy)

[![Create Toolchain](https://console.ng.bluemix.net/devops/graphics/create_toolchain_button.png)](https://console.ng.bluemix.net/devops/setup/deploy/)

### Directory structure

```none
.
├── app.js                                   // express routes
├── GulpFile.js
├── credentials.json                         // Watson service credentials
├── env.properties                           // Application properties
├── server.js
├── socket.js                                // Socket.io
├── training/                                // Training files
├── ui                                       // front end source filessrc files for the UI
├── util
│   ├── process-personality-profile.js
│   ├── process-tweet.js
│   └── twitter-helper.js
└── views                                    // Views
```


## About this pattern

For a given input, a trained Natural Language Classifier responds with a list of intent classes and a confidence score. A frequent use case is to use the user intent and confidence scores to determine how best to assist a customer. This pattern can be used to send customers to an appropriate agent, to respond to commonly asked questions, and to begin the appropriate dialog conversation as is done with the [Conversational Agent](https://github.com/watson-developer-cloud/conversational-agent-application-starter-kit) Starter Kit. This Starter Kit demonstrates the basic approach of how the Natural Language Classifier can be easily used to improve customer support.

To demonstrate this approach, the Starter Kit uses a live stream of the tweets being sent to [Twitter's @Support](https://twitter.com/Support) account. These tweets are sent to a trained Natural Language Classifier. The resulting intents and confidence scores are used to delegate the tweets or provide a potential response.

The results of Tone Analyzer, Natural Language Understanding, and Personality Insights services are used to provide quick insight into the customer. Tone Analyzer is used to determine the current mood of the user based on their tweet. Natural Language Understanding and Personality Insights are ran on each the customer's past tweets. The entity and keyword extraction of Natural Language Understanding provides a quick snapshot of the topics that the customer typically tweets about and Personality Insights determines provides an estimate of the customer's personality. This information can be used to provide an agent with quick insight into their customer or even to help send a customer to the most appropriate agent (ex. avoid sending irate customers to a new agent).

**Note**: For the purposes of this starter kit, random bodies of text are substituted for the customer's past tweets. This is done to avoid the issues involved with retrieving past at scale. For your application, past tweets can be easily retrieved by using the [IBM Insights for Twitter](https://console.ng.bluemix.net/docs/services/Twitter/index.html#twitter) Service available on Bluemix.

## Adapting/Extending the Starter Kit

This Starter Kit works off of Twitter data. However, the concepts used here are platform independent and can be applied wherever you already do customer support. This includes email, sms, Facebook, and chat/messaging apps.

The following are a basic set of instructions for how to adapt the Starter Kit to your own use case.

1. The Twitter feed can easily be changed by modifying the `TWITTER_TOPIC` variable in your `.env.js` file.
1. The Natural Language Classifier Service needs a new ground truth for your new feed. The best approach is to collect real user tweets. An easy solution is to use the [Insights for Twitter](https://console.ng.bluemix.net/docs/#services/Twitter/index.html) service available on Bluemix. Using this service, you can retrieve historical tweets from the Twitter Decahose (a 10% random sample of Tweets). Another alternative is to modify the starter kit to save incoming tweets and run the application locally. The number of tweets required will depend upon the complexity of the feed. In most cases, around 300 tweets is enough to receive respectable performance for a proof of concept, demo, or testing.
1. Create the ground truth for the Natural Language Classifier by classifying the tweets that you collected in the previous step. Further details on this process can be found in the link below.
1. Decide how the application will handle each use case. The approach taken by the Starter Kit is to provide a faq style response or to delegate the customer to an appropriate agent. This can be customized by altering the `data/default-responses.json` file. Be sure to include an entry for each intent in your classifier ground truth.
1. Use the personality insights profile to drive your customer engagement strategy. The Starter Kit simply displays a few highlights from the customer's personality but much more is possible. Some examples of how to apply the service can be found in the Personality Insight [documentation](https://www.ibm.com/watson/developercloud/doc/personality-insights/basics.shtml#overviewApply).

## Reference information

The following links provide more information about the Natural Language Classifier, Tone Analyzer, Natural Language Understanding, and Personality Insights services.

### Natural Language Classifier

* [API documentation](http://www.ibm.com/watson/developercloud/doc/natural-language-classifier/index.html): Get an in-depth knowledge of the Natural Language Classifier service
* [API reference](http://www.ibm.com/watson/developercloud/natural-language-classifier/api/v1/): SDK code examples and reference
* [API Explorer](https://watson-api-explorer.mybluemix.net/apis/natural-language-classifier-v1): Try out the API
* [Creating your own classifier](http://www.ibm.com/watson/developercloud/doc/natural-language-classifier/getting-started.html): How to use the API to create and use your own classifier

### Tone Analyzer

* [API documentation](http://www.ibm.com/watson/developercloud/doc/tone-analyzer/): Get an in-depth knowledge of the Natural Language Classifier service
* [API reference](http://www.ibm.com/watson/developercloud/tone-analyzer/api/v3/): SDK code examples and reference
* [API explorer](https://watson-api-explorer.mybluemix.net/apis/tone-analyzer-v3): Try out the REST API

### Natural Language Understanding

* [API documentation](http://www.alchemyapi.com/api): Get an in-depth understanding of the AlchemyAPI services
* [AlchemyData News reference](http://docs.alchemyapi.com/): API and query gallery

### Personality Insights

* [API documentation](http://www.ibm.com/watson/developercloud/doc/personality-insights/): Get an in-depth understanding of the Personality Insights services
* [API reference](http://www.ibm.com/watson/developercloud/personality-insights/api/v3/): SDK code examples and reference
* [API explorerer](https://watson-api-explorer.mybluemix.net/apis/personality-insights-v2): Try out the REST API


## License

  This sample code is licensed under Apache 2.0.

[tone-analyzer]: http://www.ibm.com/watson/developercloud/tone-analyzer.html
[natural-language-understanding]: http://www.ibm.com/watson/developercloud/natural-language-understanding.html
[natural-language-classifier]: http://www.ibm.com/watson/developercloud/nl-classifier.html
[personality-insights]: http://www.ibm.com/watson/developercloud/personality-insights.html
[dev-twitter]: http://apps.twitter.com
