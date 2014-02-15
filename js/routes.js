define(function (require, exports, module) {
	var views = require('views'),
		app = require('app'),
		home = require('routes/home'),
		test = require('routes/test'),
		not_found = require('routes/404');

	exports.router = new Backbone.Router();

	exports.Route = function (path, name, View) {
		exports.router.route(path, name, function () {
			var view = new View();
			app.content.show(view);
		});
	};

	exports.Route(home.path, home.name, views[home.view]);
	exports.Route(test.path, test.name, views[test.view]);
	exports.Route(not_found.path, not_found.name, views[not_found.view]);
});