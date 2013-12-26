var express = require('express'),
	fse = require('fs-extra'),
	hogan = require('hogan.js'),
	requirejs = require('requirejs'),
	server = express(),
	statics = {
		'js': true,
		'templates': true,
		'css': true,
		'favicon.ico': true,
		'robots.txt': true
	},
	output_directory = 'tmp',
	server_output_directory = 'server_tmp',
	views = {},
	shared_files = ['views', 'templates'],
	common_js_shim = 'if (typeof module === "object" && typeof define !== "function") {var define = function (factory) {module.exports = factory(require, exports, module);};}',
	require_config,
	index_template;

fse.deleteSync(output_directory);
fse.deleteSync(server_output_directory);

//Copying files to temp directory
Object.keys(statics).forEach(function (static_file) {
	fse.copySync(static_file, output_directory + '/' + static_file);
});

//Pre-compiling templates
fse.readdirSync(output_directory + '/templates').forEach(function (template) {
	var js_file = 'define(function(require, exports, module) { var hogan = require("hogan.js");',
		js_file_name = output_directory + '/js/templates/' + template.split('.')[0] + '.js';

	template = fse.readFileSync(output_directory + '/templates/' + template).toString();
	template = hogan.compile(template, {asString: true});

	js_file += 'exports = new hogan.Template(' + template +');return exports;});\n';

	fse.outputFileSync(js_file_name, js_file);
});

//Removing templates directory
fse.deleteSync(output_directory + '/templates');
delete statics['templates'];

//Copying relevant js to server directory
shared_files.forEach(function (file) {
	fse.copySync(output_directory + '/js/' + file, server_output_directory + '/' + file);

	//Adding Commonjs adapters
	fse.readdirSync(server_output_directory + '/' + file).forEach(function (item) {
		var js_file_name = server_output_directory + '/' + file + '/' + item;

		item = fse.readFileSync(js_file_name).toString();
		item = common_js_shim + item;

		fse.outputFileSync(js_file_name, item);
	});
});

//TODO: populate views from routes
views[''] = require('./' + server_output_directory + '/views/home');
views['test'] = require('./' + server_output_directory + '/views/test');
views['404'] = require('./' + server_output_directory + '/views/404');

require_config = {
	baseUrl: output_directory + '/js',
	name: 'almond',
	include: ['main'],
	mainConfigFile: output_directory + '/js/main.js',
	out: output_directory + '/tmp/main.js',
	wrap: false
};

requirejs.optimize(require_config, function (modules) {
	//Clean up optimizer
	fse.deleteSync(output_directory + '/js');
	fse.copySync(output_directory + '/tmp/main.js', output_directory + '/js/main.js');
	fse.deleteSync(output_directory + '/tmp');

	console.log('Success: ' + modules);
	index_template = hogan.compile(fse.readFileSync('index.html').toString());

	server.use(express.logger());
	server.use(express.compress());
	server.use(express.static(__dirname + '/' + output_directory));

	server.get('*', function (request, response) {
		var urls = request.params[0].split('/'),
			normalized_url,
			content;

		//remove leading slash
		urls.shift();

		//remove trailing slash if provided
		if (urls[urls.length - 1] === '') {
			urls.pop();
		}

		normalized_url = urls.join('/');

		if (views.hasOwnProperty(normalized_url)) {
			//TODO: Check for and use serializeData data method
			content = views[normalized_url].template.render({});
		} else {
			content = views['404'].template.render({});
		}

		response.send(index_template.render({
			content: content
		}));
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
}, function (error) {
	console.log('Error: ' + error);
});
