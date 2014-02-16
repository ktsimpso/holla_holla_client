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
	shared_files = ['views', 'templates', 'routes'],
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

	//Adding Commonjs adapter
	fse.readdirSync(server_output_directory + '/' + file).forEach(function (item) {
		var js_file_name = server_output_directory + '/' + file + '/' + item;

		item = fse.readFileSync(js_file_name).toString();
		item = common_js_shim + item;

		fse.outputFileSync(js_file_name, item);
	});
});

//Adding routes
fse.readdirSync(server_output_directory + '/routes').forEach(function (route) {
	var route_name = route.split('.')[0];

	route = require('./' + server_output_directory + '/routes/' + route_name);
	views[route.path] = require('./' + server_output_directory + '/views/' + route.name);
});

require_config = {
	baseUrl: output_directory + '/js',
	name: 'almond',
	include: ['main'],
	mainConfigFile: output_directory + '/js/main.js',
	out: output_directory + '/tmp/main.js',
	wrap: false
};

requirejs.optimize(require_config, function (modules) {
	var key;

	//Clean up optimizer
	fse.deleteSync(output_directory + '/js');
	fse.copySync(output_directory + '/tmp/main.js', output_directory + '/js/main.js');
	fse.deleteSync(output_directory + '/tmp');

	console.log('Success: ' + modules);
	index_template = hogan.compile(fse.readFileSync('index.html').toString());

	server.use(express.logger());
	server.use(express.compress());
	server.use(express.static(__dirname + '/' + output_directory));

	for (key in views) {
		if (views.hasOwnProperty(key)) {
			server.get('/' + key, (function (key) {
				return function (request, response) {
					response.send(index_template.render({
						content: views[key].template.render(request.params)
					}));
				};
			}(key)));
		}
	}

	server.get('*', function (request, response) {
		response.send(404, index_template.render({
			content: views['404'].template.render({})
		}));
	});

	server.use(function(error, request, response, next) {
		console.log('Error!: ' + error.stack);
		response.send(500, 'Internal Server Error');
	});

	server.listen(8000);
	console.log('Listening on port 8000');
}, function (error) {
	console.log('Error: ' + error);
});
