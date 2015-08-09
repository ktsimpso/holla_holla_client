define(function (require, exports, module) {
	var views = require('views'),
		app = require('app'),
		models = require('models'),
		routes = [];

	routes.push(require('routes/home'));
	routes.push(require('routes/404'));
	routes.push(require('routes/var'));

	exports.router = new Backbone.Router();

	routes.forEach(function (route) {
		if (!route.argument_names) {
			route.argument_names = [];
		}

		if (!route.models) {
			route.models = [];
		}

		exports.router.route(route.path, route.name, function () {
			var data = {},
				args = Array.prototype.slice.call(arguments).filter(function (arg) {
					return arg !== null;
				}),
				view,
				xhrRequests;

			if (args.length !== route.argument_names.length) {
				throw new Error('Expected ' + route.argument_names.length + ' arguments but got ' + args.length);
			}

			args.forEach(function (argument, index) {
				data[route.argument_names[index]] = argument;
			});

			xhrRequests = route.models.map(function (model) {
				var modelClass = new models[model]();
				return modelClass.fetch({
					success: function (modelClass) {
						data[model.toLowerCase()] = modelClass.toJSON();
					}
				});
			});

			$.when.apply(this, xhrRequests).then(function () {
				view = new views[route.view](data);
				app.content.show(view);
			});
		});
	});
});
