'use strict';

var vanillaExtract = require('@porsche-design-system/components-js/styles/vanilla-extract');



Object.keys(vanillaExtract).forEach(function (k) {
	if (k !== 'default' && !Object.prototype.hasOwnProperty.call(exports, k)) Object.defineProperty(exports, k, {
		enumerable: true,
		get: function () { return vanillaExtract[k]; }
	});
});
