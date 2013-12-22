var express = require('express'),
	mustache = require('mustache'),
	fs = require('fs'),
	server = express(),
	statics = {
		'js': true,
		'templates': true,
		'css': true,
		'favicon.ico': true,
		'robots.txt': true
	},
	template_utils;

template_utils = (function () {
	var exports = {},
		templates = {};

	exports.get = function (template_path) {
		if (templates.hasOwnProperty(template_path)) {
			return templates[template_path];
		}

		templates[template_path] = fs.readFileSync(template_path).toString();
		mustache.parse(templates[template_path]);

		return templates[template_path];
	};

	return exports;
}());

template_utils.get('index.html');

server.get('*', function (request, response) {
	var urls = request.params[0].split('/');
	
	//remove leading slash
	urls.shift();

	//remove trailing slash if provided
	if (urls[urls.length - 1] === '') {
		urls.pop();
	}

	if (statics[urls[0]]) {
		console.log('Serving static file: ' + urls.join('/'));
		response.sendfile(urls.join('/'));
		return;
	}

	console.log('Serving index.html');
	response.send(mustache.render(template_utils.get('index.html'), {}));
});

server.use(function(error, request, response, next) {
	if (error.status === 404) {
		console.log('No file found');
		response.send(404, 'No such file!');
		return;
	}

	console.log('Error!: ' + error.stack);
	response.send(500, 'Internal Server Error');
});

server.listen(8000);
console.log('Listening on port 8000');
