define(function (require, exports, module) {
	var Backbone = require('backbone'),
		old_sync = Backbone.sync;

	// Allow cross domain http://stackoverflow.com/questions/16041172/backbone-js-wont-make-cross-host-requests
	Backbone.sync = function(method, model, options) {
		options || (options = {});

		if (!options.crossDomain) {
			options.crossDomain = true;
		}

		if (!options.xhrFields) {
			options.xhrFields = {withCredentials:false};
		}

		return old_sync(method, model, options);
	};

	exports['User'] = Backbone.Model.extend({
		urlRoot: 'http://localhost:3000/user'
	});

	exports['Users'] = Backbone.Collection.extend({
		model: exports['User'],
		url: 'http://localhost:3000/user'
	});
});
