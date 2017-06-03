var hover_text = require('../training/personality-insights-descriptions');

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
  };
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
  };
};
