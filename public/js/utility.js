fetchServer = function (url, method, bodydata) {
  return new Promise((resolve, reject) => {
    let fetch_func
    if (method == 'GET') {
      fetch_func = fetch(url, {
        method: method,
        timeout: 3000,
        headers: {'Content-Type': 'application/json'},
        credentials: 'same-origin'
      })
    } else {
      fetch_func = fetch(url, {
        method: method,
        timeout: 3000,
        body: JSON.stringify(bodydata),
        headers: {'Content-Type': 'application/json'},
        credentials: 'same-origin'
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

calWidthHeight = function(width, height, maxWidth, maxHeight) {
  var maxR = maxWidth / maxHeight
  var r = width / height
  var resultWidth, resultHeight
  if (maxR > r) {
    resultHeight = maxHeight
    resultWidth = resultHeight * r
  } else {
    resultWidth = maxWidth
    resultHeight = resultWidth / r
  }
  return {width: resultWidth, height: resultHeight}
}