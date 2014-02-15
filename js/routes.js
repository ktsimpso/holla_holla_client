define(function (require, exports, module) {
	var views = require('views'),
		app = require('app'),
		home = require('routes/home'),
		test = require('routes/test'),
		not_found = require('routes/404'),
		var_test = require('routes/var');

	exports.router = new Backbone.Router();

	exports.Route = function (path, name, View, argument_names) {
		if (!argument_names) {
			argument_names = [];
		}

		exports.router.route(path, name, function () {
			var data = {
					data: {}
				},
				args = Array.prototype.slice.call(arguments),
				view;

			if (args.length !== argument_names.length) {
				throw new Error('Expected ' + argument_names.length + ' arguments but got ' + args.length);
			}

			args.forEach(function (argument, index) {
				data.data[argument_names[index]] = argument;
			});

			view = new View(data);

			app.content.show(view);
		});
	};

	exports.Route(home.path, home.name, views[home.view]);
	exports.Route(test.path, test.name, views[test.view]);
	exports.Route(not_found.path, not_found.name, views[not_found.view]);
	exports.Route(var_test.path, var_test.name, views[var_test.view], var_test.argument_names);
});
