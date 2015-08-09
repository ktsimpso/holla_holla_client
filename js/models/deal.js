define(function (require, exports, module) {
	exports = {
		name: 'deal',
		urlRoot: 'http://localhost:3000/deal',
		parse: function (response) {
			var human_date = new Date(response['date']);
			response['human_date'] = human_date.toDateString();
			return response;
		}
	};

	return exports;
});
