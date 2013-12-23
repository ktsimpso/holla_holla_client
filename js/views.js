define(function (require, exports, module) {
	var Marionette = require('backbone.marionette');
		
	exports.BaseView = Marionette.View.extend({
		serializeData: function () {
			return {};
		},
		render: function () {
			this.$el.html(this.template.render(this.serializeData()));
		}
	});

	exports['Home'] = this.BaseView.extend({
		template: require('templates/home')
	});

	exports['Test'] = this.BaseView.extend({
		template: require('templates/test')
	});

	exports['NotFound'] = this.BaseView.extend({
		template: require('templates/404')
	});

	return exports;
});