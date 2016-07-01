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

var hover_text = require('../data/personality-insights-descriptions');

/**
 * Filter out maximun and minimum traits
 * @param  {Object} profile The Personality Insights profile
 * @return {Object}      The processed profile
 */

function getMax(list){
  var max = 0;
  var id;
  list.forEach(function(entry, i) {
    if(entry.percentage > max) {
      max = entry.percentage;
      id = i;
    }
  });
  return list[id];
}

function getMin(list){
  var min = 1;
  var id;
  list.forEach(function(entry, i) {
    if(entry.percentage < min) {
      min = entry.percentage;
      id = i;
    }
  });
  return list[id];
}

function createEntry(treeName, status, item){
  return {
    tree: treeName,
    status: status,
    category_name: item.name,
    text: item.name,
    hover_text: hover_text[treeName][item.name]
  }
}

module.exports = function processProfile(profile) {
  if( !profile || !profile.tree) {
    return {};
  }
  return {
    big5: [
      createEntry('big5', true, getMax(profile.tree.children[0].children[0].children)),
      createEntry('big5', false, getMin(profile.tree.children[0].children[0].children))
    ],
    needs: [
      createEntry('needs', true, getMax(profile.tree.children[1].children[0].children)),
      createEntry('needs', false, getMin(profile.tree.children[1].children[0].children))
    ],
    values: [
      createEntry('values', true, getMax(profile.tree.children[2].children[0].children)),
      createEntry('values', false, getMin(profile.tree.children[2].children[0].children))
    ]
  }
}