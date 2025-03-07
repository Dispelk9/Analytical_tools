'use strict';

var partials = require('@porsche-design-system/components-js/partials');



Object.keys(partials).forEach(function (k) {
	if (k !== 'default' && !Object.prototype.hasOwnProperty.call(exports, k)) Object.defineProperty(exports, k, {
		enumerable: true,
		get: function () { return partials[k]; }
	});
});
