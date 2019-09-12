var fetch = require('node-fetch')
var fs = require('fs')
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
  return new Promise((resolve, reject) => {
    let fetch_func
    if (method == 'GET') {
      fetch_func = fetch(url, {
        method: method,
        timeout: 3000,
      })
    } else {
      fetch_func = fetch(url, {
        method: method,
        timeout: 3000,
        body: JSON.stringify(bodydata),
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

function fileExist(filePath) {
  return new Promise((resolve, reject) => {
    fs.access(filePath, fs.F_OK, (err) => {
      if (err) {
        return resolve(false);
     }
      //file exists
      resolve(true);
    })
  });
 }

module.exports = {
  getLocale: getLocale,
  fetchServer: fetchServer,
  apiServer: apiServer,
  fileExist: fileExist,
}
