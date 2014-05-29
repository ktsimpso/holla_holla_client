define(function (require, exports, module) {
	var Backbone = require('backbone'),
		old_sync = Backbone.sync,
		models = [];

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

	models.push(require('models/user'));
	models.push(require('models/deal'));

	models.forEach(function (model) {
		exports[model.name] = Backbone.Model.extend(model);
		exports[model.name + 's'] = Backbone.Collection.extend({
			model: exports[model.name],
			url: model.urlRoot
		});
	});
});
