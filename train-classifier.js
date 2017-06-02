'use strict';
var debug = require('debug')('scc:train');

// This helps to run the application in local development environment
// by faking CloudFoundry's VCAP_SERVICES environment variable
process.env.VCAP_SERVICES = process.env.VCAP_SERVICES || fs.readFileSync('./credentials.json', 'utf-8');

var fs = require('fs');
var replace = require('replace');
var watson = require('watson-developer-cloud');
var naturalLanguageClassifier = new watson.natural_language_classifier({ version: 'v1' });

debug('Training Natural Language Classifier');

naturalLanguageClassifier.create({
  language: 'en',
  name: 'Twitter topics',
  training_data: fs.createReadStream('./training/classifier-training-data.csv')
}, function(err, classifier) {
  if (err) {
    debug('Error training Natural Language Classifier');
    debug(err);
  } else {
    replace({
      regex: 'REPLACE WITH YOUR CLASSIFIER ID',
      replacement: classifier.classifier_id,
      paths: ['./credentials.json'],
      recursive: true,
      silent: true
    });
  }
});

