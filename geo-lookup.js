const https = require('https');

let gContext;

// Github configuration is read from process.env
let GH_USER = process.env.GH_USER;
let GH_KEY = process.env.GH_KEY;
let GH_REPO = process.env.GH_REPO;
let GH_FILE = process.env.GH_FILE;

// Per-run cache of geographical locations, to avoid hitting Maps API unnecessarily
let GEO_CACHE = {};

// ENTRY POINT - retrieve data file from Github and decode/parse it before passing
// into getGeo (which iterates over each entry)
module.exports = function(context, data) {
  // Make the context available globally
  gContext = context;

  // Do the work!
  getGithubJson(githubFilename(), (data, err) => {
    if (!err) {
      // No error; base64 decode and JSON parse the data from the Github response
      // (see https://developer.github.com/v3/repos/contents/#get-contents)
      let content = JSON.parse(
        new Buffer(data.content, 'base64').toString('ascii')
      );

      // Retrieve the geo information for each item in the original data
      getGeo(makeIterator(content), (updatedContent, err) => {
        if (!err) {
          // Everything went well- go ahead and push back up to Github. Note that
          // we need to base64 encode the JSON to embed it into the PUT (dear god, why)
          let updatedContentB64 = new Buffer(
            JSON.stringify(updatedContent, null, 2)
          ).toString('base64');
          let pushData = {
            path: GH_FILE,
            message: 'Looked up locations, beep boop.',
            content: updatedContentB64,
            sha: data.sha
          };
          putGithubJson(githubFilename(), pushData, err => {
            context.log('All done!');
            context.done();
          });
        } else {
          gContext.log('All done with get Geo error: ' + err);
          context.done();
        }
      });
    } else {
      gContext.log('All done with error: ' + err);
      context.done();
    }
  });
};

// Given an array of entries (wrapped in an iterator), walk over each of them and populate
// the lat/long, using Google Maps API. Note that we also cache locations to try and save
// some API calls
function getGeo(itr, cb) {
  let curr = itr.next();
  if (curr.done) {
    // All done processing- pass the (now-populated) entries to the next callback
    cb(curr.data);
    return;
  }

  let location = curr.value.Location;

  // Check the cache to see if we've already looked up this location
  if (location in GEO_CACHE) {
    gContext.log(
      'Cached ' +
        location +
        ' -> ' +
        GEO_CACHE[location].lat +
        ' ' +
        GEO_CACHE[location].long
    );
    curr.value.Latitude = GEO_CACHE[location].lat;
    curr.value.Longitude = GEO_CACHE[location].long;
    getGeo(itr, cb);
    return;
  }

  // Nothing found in cache; do a lookup and cache the result
  getGoogleJson(location, (data, err) => {
    if (err) {
      gContext.log('Error on ' + location + ' :' + err);
    } else {
      if (data.results.length > 0) {
        let info = {
          lat: data.results[0].geometry.location.lat,
          long: data.results[0].geometry.location.lng
        };
        GEO_CACHE[location] = info;
        curr.value.Latitude = info.lat;
        curr.value.Longitude = info.long;
        gContext.log(location + ' -> ' + info.lat + ' ' + info.long);
      } else {
        gContext.log(
          "Didn't find anything for " + location + ' ::' + JSON.stringify(data)
        );
      }
    }
    setTimeout(() => getGeo(itr, cb), 1000);
  });
}

function makeIterator(data) {
  var i = 0;
  return {
    next: function() {
      return i < data.length
        ? {
            value: data[i++],
            done: false
          }
        : {
            data: data,
            done: true
          };
    }
  };
}

function getGoogleJson(location, cb) {
  makeJsonReq(
    {
      hostname: 'maps.googleapis.com',
      path: '/maps/api/geocode/json?address=' + encodeURIComponent(location),
      method: 'GET'
    },
    undefined,
    cb
  );
}

function getGithubJson(path, cb) {
  makeJsonReq(
    {
      hostname: 'api.github.com',
      path: path,
      method: 'GET',
      auth: GH_USER + ':' + GH_KEY,
      headers: {
        'User-Agent': +GH_USER
      }
    },
    undefined,
    cb
  );
}

function putGithubJson(path, putObj, cb) {
  makeJsonReq(
    {
      hostname: 'api.github.com',
      path: path,
      method: 'PUT',
      auth: GH_USER + ':' + GH_KEY,
      headers: {
        'User-Agent': +GH_USER
      }
    },
    JSON.stringify(putObj),
    cb
  );
}

function makeJsonReq(opts, body, cb) {
  let req = https.request(opts, res => {
    if (res.statusCode !== 200) {
      let err = new Error(
        'Request ' +
          opts.hostname +
          ' ' +
          opts.path +
          ' failed:' +
          res.statusCode +
          '\n\t:' +
          JSON.stringify(res.headers)
      );
      res.resume();
      cb(undefined, err);
      return;
    }

    res.setEncoding('utf8');

    let data = '';
    res.on('data', chunk => (data += chunk));
    res.on('end', () => {
      cb(JSON.parse(data));
    });
  });

  req.on('error', e => {
    gContext.log('Error in makeJsonReq: ' + e);
  });

  // If a body is provided, include it
  if (body != undefined) {
    req.write(body);
  }
  req.end();
}

function githubFilename() {
  return '/repos/' + GH_USER + '/' + GH_REPO + '/contents/' + GH_FILE;
}
