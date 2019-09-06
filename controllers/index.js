var express = require('express');
var router = express.Router();


var dataModule = require('../modules/data')
var commonModule = require('../modules/common')

router.get('/', async function(req, res, next) {
  res.redirect('/zh-Hant')
})

router.get('/:locale', async function(req, res, next) {
  let locale = commonModule.getLocale(req.params.locale)
  res.render('index', { locale: locale , 
    dashboardslides: dataModule.dashboardslides })
})

router.get('/localeredirect/:locale', async function(req, res, next) {
  let locale = commonModule.getLocale(req.params.locale)
  let referer = req.headers.referer 
  let redirectlink = '/' + locale
  if (referer != null && referer != undefined) {
    let strary1 = referer.split('//')
    if (strary1.length == 2) {
      let strary2 = strary1[1].split('/')
      if (strary2.length >= 3) {
        let frontlen = strary2[0].length + strary2[1].length + 1
        redirectlink = '/' + locale + strary1[1].substring(frontlen, strary1[1].length)
      }
    } 
  }
  res.redirect(redirectlink)
})

router.get('/:locale/event', async function(req, res, next) {
  let locale = commonModule.getLocale(req.params.locale)
  let event = ""
  let cat = ""
  if (req.query.event != undefined && req.query.event != null) {
    event = req.query.event
  }
  if (req.query.cat != undefined && req.query.cat != null) {
    cat = req.query.cat
  }
  let url = commonModule.apiServer + "/api/visualdata?event=" + event + "&cat=" + cat
  let result = await commonModule.fetchServer(url, "GET", {})
  res.setHeader('Content-Type', 'application/json');
  res.status(200).send({ data: {locale: locale, visualdata: result.data}, status: 'success' })
})

router.get('/:locale/eventintro', async function(req, res, next) {
  res.render('events/213extradition')
})

router.get('/:locale/gallery', async function(req, res, next) {
  let locale = commonModule.getLocale(req.params.locale)
  let events = dataModule.events[locale]
  res.render('gallery', { locale: locale, events: events })
})

router.get('/:locale/mapevent', async function(req, res, next) {
  let locale = commonModule.getLocale(req.params.locale)
  let event = ""
  let cat = ""
  if (req.query.event != undefined && req.query.event != null) {
    event = req.query.event
  }
  if (req.query.cat != undefined && req.query.cat != null) {
    cat = req.query.cat
  }
  let url = commonModule.apiServer + "/api/visualdata?event=" + event + "&cat=" + cat
  let result = await commonModule.fetchServer(url, "GET", {})
  res.render('mapevent', { locale: locale, visualdata: result.data })
})

module.exports = router;
