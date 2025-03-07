'use strict';

var jsdomPolyfill = require('@porsche-design-system/components-js/jsdom-polyfill');



Object.keys(jsdomPolyfill).forEach(function (k) {
	if (k !== 'default' && !Object.prototype.hasOwnProperty.call(exports, k)) Object.defineProperty(exports, k, {
		enumerable: true,
		get: function () { return jsdomPolyfill[k]; }
	});
});
