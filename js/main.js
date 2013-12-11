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

		return exports;
	}());

	if (!window.location.origin) {
		window.location.origin = window.location.protocol + "//" + window.location.hostname + (window.location.port ? ':' + window.location.port: '');
	}

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

		this.views.Home = Marionette.View.extend({
			template: template_utils.get(origin + '/templates/home.mustache'),
			render: function () {
				this.$el.html(this.template({}));
			} 
		});

		this.router.route('', 'home', function () {
			var home_view = new that.views.Home();
			that.content.show(home_view);
		});

		this.views.Test = Marionette.View.extend({
			template: template_utils.get(origin + '/templates/test.mustache'),
			render: function () {
				this.$el.html(this.template({}));
			}
		});

		this.router.route('test', 'test', function () {
			var test_view = new that.views.Test();
			that.content.show(test_view);
		});

		this.views.NotFound = Marionette.View.extend({
			template: template_utils.get(origin + '/templates/404.mustache'),
			render: function () {
				this.$el.html(this.template({}));
			}
		});

		this.router.route('404', '404', function () {
			var not_found_view = new that.views.NotFound();
			that.content.show(not_found_view);
		});

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