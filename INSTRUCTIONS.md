# Watson Hands On Labs - Social Customer Care

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

   ```none
   git clone https://github.com/watson-developer-cloud/social-customer-care.git
   ```

1. [Sign up][sign_up] in Bluemix or use an existing account.
1. If it is not already installed on your system, download and install the [Cloud-foundry CLI][cloud_foundry] tool.
1. Edit the `manifest.yml` file in the folder that contains your code and replace `social-customer-care` with a unique name for your application. The name that you specify determines the application's URL, such as `application-name.mybluemix.net`. The relevant portion of the `manifest.yml` file looks like the following:

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

1. Connect to Bluemix by running the following commands in a terminal window:

  ```none
  cf api https://api.ng.bluemix.net
  cf login -u <your-Bluemix-ID> -p <your-Bluemix-password>
  ```

1. Create and retrieve service keys to access the [Natural Language Classifier][natural_language_classifier] by running the following command:

  ```none
  cf create-service natural_language_classifier standard natural-language-classifier-service
  cf create-service-key natural-language-classifier-service myKey
  cf service-key natural-language-classifier-service myKey
  ```

1. Create and retrieve service keys to access the [AlchemyLanguage][alchemy_language] by running the following command:

  ```none
  cf create-service alchemy_api free alchemy-language-service
  cf create-service-key alchemy-language-service myKey
  cf service-key alchemy-language-service myKey
  ```

1. Create and retrieve service keys to access the [Tone Analyzer][tone_analyzer] by running the following command:

  ```none
  cf create-service tone_analyzer standard tone-analyzer-service
  cf create-service-key tone-analyzer-service myKey
  cf service-key tone-analyzer-service myKey
  ```
  
1. Create and retrieve service keys to access the [Personality Insights][personality_insights] by running the following command:

  ```none
  cf create-service personality_insights tiered personality-insights-service
  cf create-service-key personality-insights-service myKey
  cf service-key personality-insights-service myKey
  ```
  
1. The Natural Language Classifier requires training prior to using the application. The training data is provided in `data/classifier-training-data.csv`. Adapt the following curl command to train your classifier (replace the username and password with the service credentials of the Natural Language Classifier created in the last step). Save the `classifier_id` from the returned json:

    ```sh
    curl -u "{username}":"{password}" -F training_data=@data/classifier-training-data.csv -F training_metadata="{\"language\":\"en\",\"name\":\"My Classifier\"}" "https://gateway.watsonplatform.net/natural-language-classifier/api/v1/classifiers"
    ```

1. Sign up at [dev-twitter](http://apps.twitter.com) for application credentials. Create a new application with the `Create new app` button and fill out the required form.

1. Provide the credentials from step 6 - 9 to the application by creating a `.env.js` file using this format:

    ```js
    module.exports = {
      TWITTER: JSON.stringify([{
        consumer_key: 'twitter_consumer_key',
        consumer_secret: 'twitter_consumer_secret',
        access_token_key: 'twitter_access_token_key',
        access_token_secret: 'twitter_access_token_secret'
      }]),
      
      TWITTER_TOPIC: '@support',
      
      NATURAL_LANGUAGE_CLASSIFIER_USERNAME: '<Natural Language Classfier username>',
      NATURAL_LANGUAGE_CLASSIFIER_PASSWORD: '<Natural Language Classfier password>',
      CLASSIFIER_ID: ' CLASSIFIER ID',
      
      PERSONALITY_INSIGHTS_USERNAME: '<Personality Insights username>',
      PERSONALITY_INSIGHTS_PASSWORD: '<Personality Insights password>',

      TONE_ANALYZER_USERNAME: '<Tone Analyzer username>',
      TONE_ANALYZER_PASSWORD: '<Tone Analyzer password>',
      
      ALCHEMY_API_KEY: '<Alchemy API apikey>'
    };
    ```

1. Install the dependencies you application need:

  ```none
  npm install
  ```

1. Build the application UI:

  ```none
  npm run build
  ```
  
1. Start the application by running:

  ```none
  gulp
  ```

1. Test your application locally by going to: [http://localhost:5000/](http://localhost:5000/)

## Deploying your application to Bluemix    

1. Push the updated application live by running the following command:

  ```none
  cf push
  ```



After completing the steps above, you are ready to test your application. Start a browser and enter the URL of your application.

                  <application-name>.mybluemix.net

You can also find your application name when you click on your application in Bluemix.

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
