"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.integerToHexColor = void 0;
/**
 * @param integerColor expects a 24bit rgb integer (left to right: 8bits red, 8bits green, 8bits blue)
 */
function integerToHexColor(integerColor) {
    return '#' + (integerColor + 16777216).toString(16).substring(1);
}
exports.integerToHexColor = integerToHexColor;
//# sourceMappingURL=util.js.map