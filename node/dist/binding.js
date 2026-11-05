"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bindings = void 0;
var path_1 = require("path");
/**
 * bindings are not typed yet.
 * if the available function names are required they can be found inside of `../src/module.c`
 */
exports.bindings = require('node-gyp-build')(path_1.join(__dirname, '../'));
exports.default = exports.bindings;
//# sourceMappingURL=binding.js.map