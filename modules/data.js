'use strict';
const yaml = require('js-yaml')
const fs = require('fs')
const _ = require('lodash')

var localeList = ["zh-Hant", "zh-Hans", "en"]
var defaultLocale = "zh-Hant"
var dashboardslides = yaml.safeLoad(fs.readFileSync('./data/dashboardslide.yaml', 'utf8'))
var events = {}

var loadEvents = async function() {
  for (let locale of localeList) {
    events[locale] = []
  }
  let eventyaml = yaml.safeLoad(fs.readFileSync('./data/event.yaml', 'utf8'))
  for (let locale of localeList) {
    events[locale] = []
  }
  for (let item of eventyaml) {
    for (let locale of localeList) {
      let title = _.find(item.title, {locale: locale})
      if (title == undefined || title == null) {
        title = _.find(item.title, {locale: defaultLocale})
      }
      let desc = _.find(item.desc, {locale: locale})
      if (desc == undefined || desc == null) {
        desc = _.find(item.desc, {locale: defaultLocale})
      }
      events[locale].push({
        event: item.event,
        date: item.date,
        title: title.name,
        desc: desc.name,
      })

    }
  }
}

loadEvents()


module.exports = {
  dashboardslides: dashboardslides,
  events: events,
}