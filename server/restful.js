var express = require('express');
var fs = require('fs');
var multiparty = require('multiparty');
var util = require('util');
var app = express();
var dirWalker = require('./src/js/dirWalker');

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
		fs.writeFile('progresspage.json', JSON.parse(fileData), 'utf8', function(err) {
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

		fs.writeFile('progresspage.json', JSON.parse(filedata), function(err) {
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
		fs.writeFile('progresspage.json', JSON.parse(filedata), function(err) {
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

/*
 * 文件上传
 */
app.get('/uploadFile', function(req, res) {
	res.sendFile(__dirname + '/src/view/uploadFile.html');
});
app.post('/uploadFile/uploading', function(req, res, next) {
	var form = new multiparty.Form({uploadDir: __dirname + '/data/'});

	form.parse(req, function(err, fields, files) {
		var filesTmp = JSON.stringify(files, null, 2);

		if (err) {
			console.log('parse error: ' + err);
		} else {
			var inputFile = files.inputFile[0];
			var uploadedPath = inputFile.path;
			var dstPath = __dirname +'/data/' + inputFile.originalFilename;
			fs.rename(uploadedPath, dstPath, function(err) {
				if (err) {
					console.log('rename error: ' + err);
				}
			});
		}
		res.end('上传成功');
	});
});

/*
 * 文件列表
 */
app.get('/fileList',function(req,res){
	dirWalker.walk(__dirname, 0, function (path, floor) {
		var blankStr = '';
		for (var i = 0; i < floor; i++) {
			blankStr += '    ';
		}
	
		fs.stat(path, function(err, stats) {
			if (err) {
				console.log('stat error');
			} else {
				var filepath = '';
				if (stats.isDirectory()) {
					filepath += '+' + blankStr + path;
				} else {
					filepath +='-' + blankStr + path;
				}
				res.write(JSON.stringify(filepath));
			}
		});
	});

});

/*
 * 删除文件
 */
app.get('/deleteFile/:path/:filename', function(req,res){
	var path = __dirname + '\\' + req.params.path +'\\' + req.params.filename;

	fs.unlink(path,function(){
		console.log('Delete File Success...' + path);
	});
	res.end('Delete File Success...' + path);
});

/*
 * 重命名文件
 */
app.get('/renameFile/:path/:oldfilename/:newfilename', function(req, res){
	var oldfilepath = __dirname + '\\' + req.params.path + '\\' + req.params.oldfilename;
	var newfilepath = __dirname + '\\' + req.params.path + '\\' + req.params.newfilename;

	fs.rename(oldfilepath,newfilepath, function(err){
		console.log('Rename File success...');
	});
	res.end('Rename File success...');
});

/*
 *在线改JSON文件内容
 */
app.get('/updateFile/:filename', function(req,res){
	res.sendFile(__dirname + '/src/view/' + req.params.filename + '.html');
});
app.get('/updateFile/:path/:file', function(req, res){
    var path = req.params.path;
    var file = req.params.file;

	fs.readFile(__dirname + '\\' + path + '\\' + file + '.json','utf8', function(err, data) {
		data = JSON.parse(data);
		if(err){console.error(err);};
		res.end(JSON.stringify(data));
	});
});
app.get('/updatting/data/:filename', function(req, res){
	var updateContent = req.query.txtContent;
	var filename = req.params.filename;
	
	fs.writeFile(__dirname + '/data/' + filename + '.json', updateContent, 'utf8', function(err){
		if(err){console.error(err)}
	});
	
	res.end('Update File success...');
});

app.listen(8010);
console.log('Listening on port 8010...');