var fetch = require('node-fetch')
var _ = require('lodash')

var apiServer = process.env.SERVERURL
var localeList = ["zh-Hant", "zh-Hans", "en"]
var defaultLocale = "zh-Hant"

var getLocale = function(locale) {
  if (localeList.includes(locale)) {
    return locale
  } else {
    return defaultLocale
  }
}


fetchServer = function (url, method, bodydata) {
  console.log("TEST")
  return new Promise((resolve, reject) => {
    // bodydata.authenticity_token = $("meta[name='csrf-token']").attr('content')
    let fetch_func
    if (method == 'GET') {
      console.log(url)
      fetch_func = fetch(url, {
        method: method,
        timeout: 3000,
        // headers: {
        //   'Content-Type': 'application/json',
        //   'X-AUTH-TOKEN': $("meta[name='csrf-token']").attr('content')
        // },
        // credentials: 'same-origin'
      })
    } else {
      fetch_func = fetch(url, {
        method: method,
        timeout: 3000,
        body: JSON.stringify(bodydata),
        // headers: {
        //   'Content-Type': 'application/json'
        // },
        // credentials: 'same-origin'
      })
    }

    fetch_func.then((res) => {
      if (res.status >= 200 && res.status <= 304) {
        res.json().then((jsonData) => {
          resolve(jsonData)
        }, (err) => {
          reject(err)
        })
      } else {
        res.json().then((jsonData) => {
          reject(jsonData)
        }, (err) => {
          reject(err)
        })
      }
    })
  })
}

module.exports = {
  getLocale: getLocale,
  fetchServer: fetchServer,
  apiServer: apiServer
}
