var express = require('express');
var fs = require('fs');
var multiparty = require('multiparty');
var util = require('util');
var app = express(),
	upload = express();

app.all('/data/*', function(req, res, next) {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Headers', 'X-Requested-With');
	res.header('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS');
	res.header('X-Powered-By', ' 3.2.1')
	res.header('Content-Type', 'application/json;charset=utf-8');
	next();
});

app.get('/data/auth/:id/:password', function(req, res) {
	res.send({
		id: req.params.id,
		name: req.params.password
	});
});

app.get('/data/:category', function(req, res) {
	//console.log('/////// req //////', req);
	//console.log('/////// res //////', res);
	fs.readFile(__dirname + '/data/' + req.params.category + '.json', 'utf8', function(err, data) {
		res.end(data);
	});
});

app.get('/data/:id', function(req, res) {
	fs.readFile(__dirname + '/data/' + 'users.json', 'utf8', function(err, data) {
		data = JSON.parse(data);
		var user = data['user' + req.params.id]
		//console.log(user);
		res.end(JSON.stringify(user));
	});
})

app.get('/data/add-progress/:job', function(req, res) {
	fs.readFile(__dirname + '/data/' + 'progresspage.json', 'utf8', function(err, data) {
		var job = req.params.job;
		var progress = req.params.progress;
		var thread = req.params.thread;
		var triggered = req.params.triggered;
		var discovered = req.params.discovered;
		var nextInvocation = req.paramas.nextInvocation;
		var previousInvocation = req.paramas.previousInvocation;

		var addData = new Buffer('{"job":"' + job + '","progress":"' + progress + '","thread":"' + thread + '","triggered":"' + triggered + '","discovered":"' + discovered + '","nextInvocation":"' + nextInvocation + '","previousInvocation":"' + previousInvocation + '"}');
		var fileData = JSON.parse(data);

		fileData.push(JSON.parse(addData));
		fs.writeFile('progresspage.json', JSON.stringify(fileData), 'utf8', function(err) {
			if (err) {
				console.error(err);
			}
		});
	});
});

app.get('/data/delete-progress/:job', function(req, res) {
	fs.readFile(__dirname + '/data/' + 'progresspage.json', 'utf8', function(err, data) {
		var job = req.params.job;
		var filedata = JSON.parse(data);

		for (var i = 0; i < filedata.length; i++) {
			if (filedata[i].job == job) {
				filedata.splice(i, 1);
				break;
			}
		}

		fs.writeFile('progresspage.json', JSON.stringify(filedata), function(err) {
			if (err) {
				console.error(err);
			}
		});
	});
});

app.get('/data/update-progress/:job/:progress/:thread/:triggered/:discovered/:nextInvocation/:previousInvocation', function(req, res) {
	fs.readFile(__dirname + '/data/' + 'progresspage.json', 'utf8', function(err, data) {
		var job = req.params.job;
		var progress = req.params.progress;
		var thread = req.params.thread;
		var triggered = req.params.triggered;
		var discovered = req.params.discovered;
		var nextInvocation = req.paramas.nextInvocation;
		var previousInvocation = req.paramas.previousInvocation;

		var filedata = JSON.parse(data);

		for (var i = 0; i < filedata.length; i++) {
			if (filedata[i].job == job) {
				filedata[i].progress = progress;
				filedata[i].thread = thread;
				filedata[i].triggered = triggered;
				filedata[i].discovered = discovered;
				filedata[i].nextInvocation = nextInvocation;
				filedata[i].previousInvocation = previousInvocation;
				break;
			}
		}
		fs.writeFile('progresspage.json', JSON.stringify(filedata), function(err) {
			if (err) {
				console.error(err);
			}
		});
	});
});

app.get('/data/search-progress/:job', function(req, res) {
	var job = req.params.job;
	var filedata = JSON.parse(data);

	for (var i = 0; i < filedata.length; i++) {
		if (filedata[i].job == job) {
			var searchdata = filedata[i];
			break;
		}
	}
	res.end(JSON.stringify(searchdata));
});

app.get('/uploadFile', function(req, res) {
	res.sendFile(__dirname + '/src/view/uploadFile.html');
});

app.post('/uploadFile/uploading', function(req, res, next) {
	//生成multiparty对象，并配置上传目标路径
	var form = new multiparty.Form({
		uploadDir: __dirname + '/data/'
	});
	//上传完成后处理
	form.parse(req, function(err, fields, files) {
		var filesTmp = JSON.stringify(files, null, 2);

		if (err) {
			console.log('parse error: ' + err);
		} else {
			var inputFile = files.inputFile[0];
			var uploadedPath = inputFile.path;
			var dstPath = __dirname +'/data/' + inputFile.originalFilename;
			//重命名为真实文件名
			fs.rename(uploadedPath, dstPath, function(err) {
				if (err) {
					console.log('rename error: ' + err);
				}
			});
		}

		res.writeHead(200, {
			'content-type': 'text/plain;charset=utf-8'
		});
		res.write('上传成功');
		res.end();
	});
});

app.listen(8010);
console.log('Listening on port 8010...');