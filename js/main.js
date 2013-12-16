(function () {
	var template_utils,
		app;

	template_utils = (function () {
		var exports = {},
			templates = {};

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
	}());

	app = new Backbone.Marionette.Application();

	app.addRegions({
		content: '.content'
	});

	app.addInitializer(function () {
		var that = this,
			origin = window.location.origin,
			success;

		this.router = new Backbone.Router();
		this.views = {};

		$(document).on('click', 'a', function (e) {
			var self = $(this),
				href = self.attr('href');

			e.preventDefault();
			
			that.router.navigate(href, {
				trigger: true
			});
		});

		this.BaseView = Marionette.View.extend({
			serializeData: function () {
				return {};
			},
			render: function () {
				this.$el.html(this.template(this.serializeData()));
			}
		});

		this.Route = function (path, name, View) {
			that.router.route(path, name, function () {
				var view = new View();
				that.content.show(view);
			});
		};

		this.views.Home = this.BaseView.extend({
			template: template_utils.add(origin + '/templates/home.mustache')
		});

		this.views.Test = this.BaseView.extend({
			template: template_utils.add(origin + '/templates/test.mustache')
		});

		this.views.NotFound = this.BaseView.extend({
			template: template_utils.add(origin + '/templates/404.mustache')
		});

		this.Route('', 'home', this.views.Home);
		this.Route('test', 'test', this.views.Test);
		this.Route('404', '404', this.views.NotFound);

		success = Backbone.history.start({
			pushState: true
		});

		if (!success) {
			this.router.navigate('404', {
				trigger: true,
				replace: true
			});
		}
	});

	app.start({});
}());