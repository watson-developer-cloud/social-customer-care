/**
 * Copyright 2016 IBM Corp. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

require('../../dot-env');

var extend = require('extend');
var assert = require('assert');

var sampleTweet = {
  in_reply_to_status_id: null,
  retweeted_status: undefined
}

describe('process-tweet', function() {
  this.timeout(5000);
  this.retries(2);
  this.slow(2000);

  var processTweet = require('../../util/process-tweet');

  it('process an english tweet', function(done) {
    processTweet(extend ({ text: 'Please don\'t suspend my account'}, sampleTweet),
    function(err, result) {
      if (err) {
        done(err);
      } else {
        assert(result);
        assert(result.alchemy_language);
        assert(result.tone_analyzer);
        assert(result.classifier);
        assert(result.response);
        assert(result.tweet);
        done();
      }
    });
  });
});
