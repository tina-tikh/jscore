var utils = (function () {
  var _jsonToString = function (data) {
    return data && !_isString(data) ? 
            JSON.stringify(data) : 
            data;
  };
  var _isString = function (obj) {
    return obj.toString() == '[object String]';
  };

  return {
    ajax: function (conf) {

      var url = conf.url || '';
      var method = conf.method || 'GET';
      var mime = conf.mime;
      var data = conf.data || null;

      return new Promise(function(resolve, reject) {
        var onError = function(e) {
          reject(e);
        };
        var onLoad = function(e) {
          var request = e.target;
          if (request.status == 200) {
            resolve(request.response);
          } else {
            onError(e);
          }
        };

        var req = new XMLHttpRequest();
        req.open(method, url);

        if (mime) 
          req.setRequestHeader('Content-Type', mime);

        req.addEventListener("load", onLoad);
        req.addEventListener("error", onError);
        req.addEventListener("abort", onError);

        req.send(_jsonToString(data));
      });
    }
  };
})();
