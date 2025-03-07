'use strict';

var testing = require('@porsche-design-system/components-js/testing');



Object.keys(testing).forEach(function (k) {
	if (k !== 'default' && !Object.prototype.hasOwnProperty.call(exports, k)) Object.defineProperty(exports, k, {
		enumerable: true,
		get: function () { return testing[k]; }
	});
});
