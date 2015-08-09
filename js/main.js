require.config({
	baseUrl: '/js',
	map: {
		'*': {
			'jquery': 'jquery-2.1.4'
		}
	},
	shim: {
		'mustache': {
			deps: ['jquery'],
			exports: 'Mustache'
		}
	}
});

require(['app', 'views', 'routes'], function (app, views, routes) {
	app.addInitializer(function () {
		var that = this,
			silent = true,
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

		if (window.location.hash) {
			silent = false;
		}

		success = Backbone.history.start({
			pushState: true,
			silent: silent
		});

		if (!silent && !success) {
			this.router.navigate('404', {
				trigger: true,
				replace: true
			});
		}
	});

	app.start({});
});
