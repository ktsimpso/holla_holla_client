define(function (require, exports, module) {
	require('backbone');
	require('backbone.marionette');

	exports = new Backbone.Marionette.Application();

	exports.addRegions({
		content: '.content'
	});

	return exports;
});