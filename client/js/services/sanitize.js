app.service('sanitize', [function () {
  return {
    update: function (key, val) {
      if (key === 'phone') {
        var clean, sol = '';
        if (val) {
          clean = val.match(/\d+/g).join('').split('').reverse();
          if (clean.length <= 11) {
            for (var i=0;i<clean.length;i++) {
              if (i === 4 || i === 7 || i === 10) {
                sol += '-';
              }
              sol += clean[i];
            }
            return sol.split('').reverse().join('');
          } else {
            return clean.reverse().join('');
          }
        }
        return undefined;
      } else if (key.substr(key.length-5,key.length) === 'Price') {
        if (val) {
          if (val[0] === '$') {
            val = val.slice(1);
          }
          return Number(val);
        }
        return undefined;
      } else if (key === 'dob' || key.substr(key.length-4,key.length) === 'Date') {
        return val.substr(0,4) + val.substr(4,6);
      } else {
        console.log('no sanitization needed!');
        return val;
      }
    },

    post: function () {},

    get: function (key, val) {
      if (key === 'dob' || key.substr(key.length-4,key.length) === 'Date') {
        return val.substr(5,6) + '-' + val.substr(0,4);
      }
    }
  }  
}]);