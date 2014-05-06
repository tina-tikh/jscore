(function () {
  var onError = function(error) {
    console.error("Failed!", error);
  };

  var ttUrl = 'http://54.72.3.96:3000/techtalks/';
  var aUrl = 'http://54.72.3.96:3000/attendees/';
  var data = {
    "date": "4\/21\/2014",
    "title": "AJAX",
    "lector": [
      "alena_karaba"
    ],
    "location": "K1\/3",
    "description": "some description",
    "level": "D1-D5",
    "notes": "",
    "attendees": [
      "alena_karaba"
    ],
    "tags": [
      "ajax",
      "xmlhttpajax",
      "promises"
    ]
  };

  /* TASK #2 */
  var id = '';
  utils.ajax({
    url: ttUrl, 
    method: 'POST',
    mime: 'application/json',
    data: data
  })
  .then(JSON.parse)
  .then(function(response) {
    id = response._id;

    return utils.ajax({
      url: ttUrl + id, 
      method: 'GET'
    });
  })
  .then(JSON.parse)
  .then(function(response) {
    console.log('Newly created record:', response);

    return utils.ajax({
      url: ttUrl + id, 
      method: 'PUT',
      mime: 'application/json',
      data: {
        "level": "D2-D3"
      }
    });
  })
  .then(function(response) {
    console.log('Edited record:', response);

    return utils.ajax({
      url: ttUrl + id, 
      method: 'DELETE'
    });
  })
  .catch(function(err) {
    console.log("Task#2 failed", err);
  })
  .then(function() {
    console.log("Task#2 done!");
  })

  /* TASK #3 */
  var list = document.getElementById('ttList');

  utils.ajax({
    url: ttUrl, 
    method: 'GET'
  })
  .then(JSON.parse)
  .then(function(response) {
    var tts = response.filter(function(tt) {
      return tt.title;
    });

    var fragment = document.createDocumentFragment();
    tts.forEach(function(tt) {
      var ttEl = document.createElement('li');
      ttEl.innerHTML = tt.title;
      fragment.appendChild(ttEl);
    });
    list.appendChild(fragment);

    return tts.map(function(tt) {
      var lct = tt.lector;
      return lct && lct[0];
    });
  })
  .then(function(lectors) {
    var ttElems = list.children;
    var promises = lectors.map(function(name) {
      return new Promise(function(resolve, reject) {
        if (!name) {
          reject({message: "No lectors to display"});
        } else {
          resolve();
        }
      })
      .then(function() {
        return utils.ajax({
          url: aUrl + name
        });
      })
      .then(JSON.parse);
    });

    return promises.reduce(function(sequence, promise, index) {
      var ttEl = ttElems[index];

      return sequence.then(function() {
        return promise;
      }).then(function(lector) {
        ttEl.innerHTML += [' (', lector.full_name, ': ', lector.email, ')'].join('');
      }).catch(function(err) {
        ttEl.innerHTML += ['<div class="error">', err.message, '</div>'].join('');
      });
    }, Promise.resolve());
  })
  .catch(function(err) {
    console.log(err.message);
  })
  .then(function() {
    document.getElementById('loader').style.display = 'none';
    console.log("Task#3 done!");
  });;

})();
