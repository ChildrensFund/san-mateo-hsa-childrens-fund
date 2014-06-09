app.service('childObjSaver', [function () {
  var childObj = {};
  return {
    setChildObj: function (obj) {
      obj = obj || {};
      childObj = obj;
    },
    getChildObj: function () {
      return childObj;
    }
  }
}]);