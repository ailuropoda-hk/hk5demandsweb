const yaml = require('js-yaml')
const fs = require('fs')

var localeList = ["zh-Hant", "zh-Hans", "en"]
var dashboardslides = yaml.safeLoad(fs.readFileSync('./data/dashboardslide.yaml', 'utf8'));

module.exports = {
  dashboardslides: dashboardslides
}