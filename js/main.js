require.config({
	baseUrl: '/js',
	map: {
		'*': {
			'jquery': 'jquery-2.0.3'
		}
	},
	shim: {
		'mustache': {
			deps: ['jquery'],
			exports: 'Mustache'
		},
		'underscore': {
			exports: '_'
		},
		'backbone': {
			deps: ['underscore', 'jquery'],
			exports: 'Backbone'
		},
		'backbone.marionette': {
			deps: ['backbone'],
			exports: 'Marionette'
		}
	}
});

require(['template_utils', 'backbone.marionette', 'shims'], function (template_utils) {
	var app;

	app = new Backbone.Marionette.Application();

	app.addRegions({
		content: '.content'
	});

	app.addInitializer(function () {
		var that = this,
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
			template: template_utils.add(window.location.origin + '/templates/home.mustache')
		});

		this.views.Test = this.BaseView.extend({
			template: template_utils.add(window.location.origin + '/templates/test.mustache')
		});

		this.views.NotFound = this.BaseView.extend({
			template: template_utils.add(window.location.origin + '/templates/404.mustache')
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
});
