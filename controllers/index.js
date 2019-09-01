var express = require('express');
var router = express.Router();


var dataModule = require('../modules/data')
var commonModule = require('../modules/common')

router.get('/', async function(req, res, next) {
  let locale = req.query.locale
  res.render('index', { locale: 'zh-Hant' , 
    dashboardslides: dataModule.dashboardslides })
})

router.get('/mapevent', async function(req, res, next) {
  let locale = req.query.locale
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
  res.render('mapevent', { locale: 'zh-Hant', visualdata: result.data })
})

module.exports = router;
