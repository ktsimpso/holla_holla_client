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

require(['app', 'views', 'routes'], function (app, views, routes) {
	app.addInitializer(function () {
		var that = this,
			success;

		this.router = routes.router;
		this.views = views;

		$(document).on('click', 'a', function (e) {
			var self = $(this),
				href = self.attr('href');

			e.preventDefault();
			
			that.router.navigate(href, {
				trigger: true
			});
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
});
