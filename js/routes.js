define(function (require, exports, module) {
	var views = require('views'),
		app = require('app');

	exports.router = new Backbone.Router();

	exports.Route = function (path, name, View) {
		exports.router.route(path, name, function () {
			var view = new View();
			app.content.show(view);
		});
	};

	exports.Route('', 'home', views['Home']);
	exports.Route('test', 'test', views['Test']);
	exports.Route('404', '404', views['NotFound']);
});