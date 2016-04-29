/******************
 *
 * Express
 *
 ******************/
// var express = require('express');
// var app = express();
// var fs = require('fs');

// var user = {
//   'user4': {
//     'name': 'mohit',
//     'password': 'password4',
//     'profession': 'teacher',
//     'id': 4
//   }
// }
//
// var id = 2;
//
// app.get('/deleteUser', function(req, res) {
//   fs.readFile(__dirname + '/data/' + 'users.json', 'utf8', function(err, data) {
//     data = JSON.parse(data);
//     delete data['user' + 2];
//
//     console.log(data);
//     res.end(JSON.stringify(data));
//   });
// })
//
//
// app.get('/:id', function(req, res) {
//   fs.readFile(__dirname + '/data/' + 'users.json', 'utf8', function(err, data) {
//     data = JSON.parse(data);
//     var user = data['user' + req.params.id]
//     console.log(user);
//     res.end(JSON.stringify(user));
//   });
// })
//
// app.get('/addUser', function(req, res) {
//   fs.readFile(__dirname + '/data/' + 'users.json', 'utf8', function(err, data) {
//     data = JSON.parse(data);
//     data['user4'] = user['user4'];
//     console.log(data);
//     res.end(JSON.stringify(data));
//   });
// })

// app.get('/listUsers', function (req, res) {
//   fs.readFile(__dirname + '/data/records.json', 'utf8', function (err, data) {
//     console.log(data);
//
//       res.header('Access-Control-Allow-Origin', '*');
//       res.header('Access-Control-Allow-Headers', 'X-Requested-With');
//       res.header('Access-Control-Allow-Methods','PUT,POST,GET,DELETE,OPTIONS');
//       res.header('X-Powered-By',' 3.2.1')
//       res.header('Content-Type', 'application/json;charset=utf-8');
//       res.end(data);
//   });
// });
//
// var server = app.listen(8010, function () {
//
//   var host = server.address().address;
//   var port = server.address().port;
//
//   console.log('Open => http://%s:%s', host, port);
// });

/******************
 *
 * HTTP
 *
 ******************/

// var http = require('http');
//
// var url = require('url');
//
// var querystring = require('querystring');
//
// http.createServer(function (request, response) {
// 	var objectUrl = url.parse(request.url);
// 	var objectQuery = querystring.parse(objectUrl.query);
//
// 	response.writeHead(200,{'Content-Type':'text/plain','Access-Control-Allow-Origin':'*'});
//
// 	response.write('<h1>objectUrl</h1>');
// 	for (var i in objectUrl) {
// 		if (typeof (objectUrl[i]) != 'function') response.write(i + '=>' + objectUrl[i] + '<br>');
// 	}
//
// 	response.write('<h1>objectQuery</h1>');
// 	for (var i in objectQuery) {
// 		response.write(i + '=>' + objectQuery[i] + '<br>');
// 	}*/
//  	response.write('{'Content-Type':'text/plain','Access-Control-Allow-Origin':'*'}');
// 	response.end();
// }).listen(8010);


var express = require('express');
var fs = require('fs');
var app = express();

app.all('*', function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With');
    res.header('Access-Control-Allow-Methods','PUT,POST,GET,DELETE,OPTIONS');
    res.header('X-Powered-By',' 3.2.1')
    res.header('Content-Type', 'application/json;charset=utf-8');
    next();
});

app.get('/auth/:id/:password', function(req, res) {
    res.send({id:req.params.id, name: req.params.password});
});

app.get('/:category', function(req, res) {
  console.log('/////// req //////',req);
  console.log('/////// res //////',res);
  fs.readFile(__dirname + '/data/'+req.params.category+'.json', 'utf8', function (err, data) {
      res.end(data);
  });
});

app.get('/:id', function(req, res) {
  fs.readFile(__dirname + '/data/' + 'users.json', 'utf8', function(err, data) {
    data = JSON.parse(data);
    var user = data['user' + req.params.id]
    console.log(user);
    res.end(JSON.stringify(user));
  });
})

app.listen(8010);
console.log('Listening on port 8010...');
