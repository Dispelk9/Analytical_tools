'use strict';

var styles = require('@porsche-design-system/components-js/styles');



Object.keys(styles).forEach(function (k) {
	if (k !== 'default' && !Object.prototype.hasOwnProperty.call(exports, k)) Object.defineProperty(exports, k, {
		enumerable: true,
		get: function () { return styles[k]; }
	});
});
