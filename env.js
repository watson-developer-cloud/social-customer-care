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