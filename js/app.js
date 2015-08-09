define(function (require, exports, module) {
	require('jquery');
	require('backbone');
	require('backbone.marionette');
	require('elementqueries');

	exports = new Backbone.Marionette.Application();

	exports.addRegions({
		content: '.content'
	});

	return exports;
});
