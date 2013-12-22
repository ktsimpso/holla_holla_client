define(function (require, exports, module) {
	var templates = {},
		Mustache = require('mustache');

	exports.get = function (template_path) {
		if (templates.hasOwnProperty(template_path)) {
			return templates[template_path];
		}

		$.ajax(template_path, {
			async: false,
			success: function (data) {
				templates[template_path] = Mustache.compile(data);
			}
		});

		if (templates.hasOwnProperty(template_path)) {
			return templates[template_path];
		}

		throw 'Template: ' + template_path + ' not found'; 
	};

	exports.add = function (template_path) {
		return function () {
			return exports.get(template_path);
		};
	};

	return exports;
});
