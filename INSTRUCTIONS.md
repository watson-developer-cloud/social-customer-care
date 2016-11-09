# Watson Hands On Labs - Social Customer Care

This lab was originally created as a part of the World Developer Conference in Nov 2016.

During this lab, you will use the [Natural Language Classifier][natural_language_classifier] service to direct customer requests and queries to the appropriate agent or workflow. Additionally, [Tone Analyzer][tone_analyzer], [Alchemy Language][alchemy_language], and [Personality Insights][personality_insights] demonstrate how to efficiently provide an agent with customer insights.

You can see a version of this app that is already running [here](https://social-customer-care.mybluemix.net/). 

So let’s get started. The first thing to do is to build out the shell of our application in Bluemix.

## Creating a [IBM Bluemix][bluemix] Account

1. Go to https://bluemix.net/
2. Create a Bluemix account if required.
3. Log in with your IBM ID (the ID used to create your Bluemix account) 

**Note:** The confirmation email from Bluemix mail take up to 1 hour.

## Deploy this sample application in Bluemix

1. Clone the repository into your computer.

   ```sh
   git clone https://github.com/watson-developer-cloud/social-customer-care.git
   ```

2. [Sign up][sign_up] in Bluemix or use an existing account.
3. If it is not already installed on your system, download and install the [Cloud-foundry CLI][cloud_foundry] tool.
4. Edit the `manifest.yml` file in the folder that contains your code and replace `social-customer-care` with a unique name for your application. The name that you specify determines the application's URL, such as `application-name.mybluemix.net`. The relevant portion of the `manifest.yml` file looks like the following:

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

6. Connect to Bluemix by running the following commands in a terminal window:

  ```sh
  cf api https://api.ng.bluemix.net
  cf login -u <your-Bluemix-ID> -p <your-Bluemix-password>
  ```

7. Create an instance of the Natural Language Classifier in Bluemix by running the following command:

  ```
  cf create-service natural_language_classifier standard natural-language-classifier-service
  ```


8. Create an instance of the [AlchemyLanguage][alchemy_language] service:

  ```sh
  cf create-service alchemy_api free alchemy-language-service
  ```
  
10. Create an instance of the [Personality Insights][personality_insights] service:

  ```sh
  cf create-service personality_insights tiered personality-insights-service
  ```

8. Create and retrieve service keys to access the Natural Language Classifier:

    ```sh
    cf create-service-key natural-language-classifier-service myKey
    cf service-key natural-language-classifier-service myKey
    ```
    
9. The Natural Language Classifier requires training prior to using the application. The training data is provided in `data/classifier-training-data.csv`. Adapt the following curl command to train your classifier (replace the username and password with the service credentials of the Natural Language Classifier created in the last step):

    ```sh
    curl -u "{username}":"{password}" -F training_data=@data/classifier-training-data.csv -F training_metadata="{\"language\":\"en\",\"name\":\"My Classifier\"}" "https://gateway.watsonplatform.net/natural-language-classifier/api/v1/classifiers"
    ```

10. Create and retrieve service keys for the Alchemy Language service. If you are using an existing alchemy service, use those credentials instead.

    ```sh
    cf create-service-key alchemy-language-service myKey
    cf service-key alchemy-language-service myKey
    ```

11. Sign up at [apps.twitter.com][dev-twitter] for application credentials. Create a new application with the `Create new app` button and fill out the required form.

12. Provide the credentials to the application by creating a `.env.js` file using this format:

    ```js
    module.exports = {
      TWITTER: JSON.stringify([{
        consumer_key: 'twitter_consumer_key',
        consumer_secret: 'twitter_consumer_secret',
        access_token_key: 'twitter_access_token_key',
        access_token_secret: 'twitter_access_token_secret'
      }]),
      TWITTER_TOPIC: '@support',
      CLASSIFIER_ID: ' CLASSIFIER ID',
      ALCHEMY_API_KEY: 'ALCHEMY KEY',
      DEBUG: 'scc:*'
    };
    ```

13. Push the updated application live by running the following command:

    ```sh
    cf push
    ```


## Test

JEFF WRITE SOMETHING HERE TELLING THEM TO GO TO THE BLUEMIX APP.


# Congratulations

You have completed the Social Customer Care Lab! :bowtie:

 ![Congratulations](http://i.giphy.com/ENagATV1Gr9eg.gif)

[sign_up]: https://bluemix.net/registration
[bluemix]: https://console.ng.bluemix.net/
[wdc_services]: http://www.ibm.com/watson/developercloud/services-catalog.html
[alchemy_language]: http://www.ibm.com/watson/developercloud/doc/alchemylanguage
[personality_insights]: http://www.ibm.com/watson/developercloud/doc/personality-insights
[natural_language_classifier]: http://www.ibm.com/watson/developercloud/doc/nl-classifier
[tone_analyzer]: http://www.ibm.com/watson/developercloud/doc/tone-analyzer
[cloud_foundry]: https://github.com/cloudfoundry/cli
