if (typeof module === 'object' && typeof define !== 'function') {
	var define = function (factory) {
		module.exports = factory(require, exports, module);
	};
}

define(function (require, exports, module) {
	exports = {
		template: require('../templates/404')
	};

	return exports;
});
