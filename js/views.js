define(function (require, exports, module) {
	var Marionette = require('backbone.marionette'),
		template_utils = require('template_utils');
		
	exports.BaseView = Marionette.View.extend({
		serializeData: function () {
			return {};
		},
		render: function () {
			this.$el.html(this.template(this.serializeData()));
		}
	});

	exports['Home'] = this.BaseView.extend({
		template: template_utils.add(window.location.origin + '/templates/home.mustache')
	});

	exports['Test'] = this.BaseView.extend({
		template: template_utils.add(window.location.origin + '/templates/test.mustache')
	});

	exports['NotFound'] = this.BaseView.extend({
		template: template_utils.add(window.location.origin + '/templates/404.mustache')
	});

	return exports;
});