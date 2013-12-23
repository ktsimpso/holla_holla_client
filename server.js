var express = require('express'),
	fse = require('fs-extra'),
	hogan = require('hogan.js'),
	server = express(),
	statics = {
		'js': true,
		'templates': true,
		'css': true,
		'favicon.ico': true,
		'robots.txt': true
	},
	output_directory = 'tmp',
	index_template;

//Copying files to temp directory
Object.keys(statics).forEach(function (static_file) {
	fse.copySync(static_file, output_directory + '/' + static_file);
});

//Pre-compiling templates
fse.readdirSync(output_directory + '/templates').forEach(function (template) {
	var js_file = 'define(function(require, exports, module) { var hogan = require("hogan");',
		js_file_name = output_directory + '/js/templates/' + template.split('.')[0] + '.js';

	template = fse.readFileSync(output_directory + '/templates/' + template).toString();
	template = hogan.compile(template, {asString: true});

	js_file += 'exports = new hogan.Template(' + template +');return exports;});\n';

	fse.outputFileSync(js_file_name, js_file);
});

index_template = hogan.compile(fse.readFileSync('index.html').toString());

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
		urls.unshift(output_directory);
		response.sendfile(urls.join('/'));
		return;
	}

	console.log('Serving index.html');
	response.send(index_template.render({}));
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
