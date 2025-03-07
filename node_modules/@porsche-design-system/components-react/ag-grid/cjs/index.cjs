'use strict';

var agGrid = require('@porsche-design-system/components-js/ag-grid');



Object.keys(agGrid).forEach(function (k) {
	if (k !== 'default' && !Object.prototype.hasOwnProperty.call(exports, k)) Object.defineProperty(exports, k, {
		enumerable: true,
		get: function () { return agGrid[k]; }
	});
});
