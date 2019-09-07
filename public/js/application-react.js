class GlobalStore {
  constructor() {
    this.datasetToObject = this.datasetToObject.bind(this);
  }

  datasetToObject (elem) {
    var data = {};
    [].forEach.call(elem.attributes, function(attr) {
      if (/^data-/.test(attr.name)) {
        var camelCaseName = attr.name.substr(5).replace(/-(.)/g, function ($0, $1) {
          return $1.toUpperCase();
        });
        data[camelCaseName] = attr.value;
      }
    });
    return data;
  }
}


window.globalStore = new GlobalStore();
