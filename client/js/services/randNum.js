app.service('randNum', [function () {
  return function () {
    return Math.floor(Math.random()*10e10);
  }
}]);