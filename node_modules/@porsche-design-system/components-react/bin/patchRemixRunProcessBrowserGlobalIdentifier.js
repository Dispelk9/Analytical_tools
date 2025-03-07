#!/usr/bin/env node
'use strict';

var path = require('path');
var fs = require('fs');

function _interopNamespaceDefault(e) {
    var n = Object.create(null);
    if (e) {
        Object.keys(e).forEach(function (k) {
            if (k !== 'default') {
                var d = Object.getOwnPropertyDescriptor(e, k);
                Object.defineProperty(n, k, d.get ? d : {
                    enumerable: true,
                    get: function () { return e[k]; }
                });
            }
        });
    }
    n.default = e;
    return Object.freeze(n);
}

var path__namespace = /*#__PURE__*/_interopNamespaceDefault(path);
var fs__namespace = /*#__PURE__*/_interopNamespaceDefault(fs);

const patchRemixRunProcessBrowserGlobalIdentifier = () => {
    const packageEntry = require.resolve('@remix-run/dev');
    const compilerDirPaths = [
        path__namespace.resolve(packageEntry, '../compiler'),
        path__namespace.resolve(packageEntry, '../compiler/js'), // since 1.16.0 the file was moved into js sub-folder
    ].filter(fs__namespace.existsSync);
    const filePaths = compilerDirPaths
        .map((compilerDirPath) => fs__namespace.readdirSync(compilerDirPath).map((fileName) => `${compilerDirPath}/${fileName}`))
        .flat()
        // file is currently called compileBrowser.js
        // since 1.16.0 the file is called compiler.js
        .filter((fileName) => fileName.match(/\/(?:compileBrowser|compiler)\.js$/));
    filePaths.forEach((filePath) => {
        const filePathBackup = filePath.replace(/\.js$/, '-original$&');
        if (!fs__namespace.existsSync(filePathBackup)) {
            fs__namespace.copyFileSync(filePath, filePathBackup);
        }
        else {
            fs__namespace.copyFileSync(filePathBackup, filePath);
        }
        const fileContent = fs__namespace.readFileSync(filePath, 'utf8');
        // we want to extend the define config
        // https://github.com/remix-run/remix/blob/main/packages/remix-dev/compiler/js/compiler.ts#L221-L226
        if (fileContent.match(/define: \{/)) {
            // prepending should be safer than appending because JSON.stringify() might be multiline like in source
            // https://github.com/remix-run/remix/blob/05ffb6e2db8f2a0e09caffad6e9b3c897c34cb7d/packages/remix-dev/compiler/compileBrowser.ts#L159-L163
            const newFileContent = fileContent.replace(/"process\.env\.NODE_ENV": JSON\.stringify\(.*/, '"process.browser": "true", // added by Porsche Design System\'s patchRemixRunProcessBrowserGlobalIdentifier.js\n      $&');
            const prettyFilePath = filePath.replace(packageEntry.substring(0, packageEntry.indexOf('/node_modules')), '.');
            if (newFileContent.includes('"process.browser": "true"')) {
                console.log(`Successfully patched ${prettyFilePath}`);
            }
            else {
                console.error(`Patching ${prettyFilePath} failed`);
            }
            fs__namespace.writeFileSync(filePath, newFileContent);
        }
    });
};
patchRemixRunProcessBrowserGlobalIdentifier();

exports.patchRemixRunProcessBrowserGlobalIdentifier = patchRemixRunProcessBrowserGlobalIdentifier;
