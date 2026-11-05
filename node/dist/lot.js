"use strict";
/* eslint-disable camelcase */
Object.defineProperty(exports, "__esModule", { value: true });
exports.Lot = void 0;
var binding = require('../binding');
var debug = require('debug')('deltachat:node:lot');
/**
 * Wrapper around dc_lot_t*
 */
var Lot = /** @class */ (function () {
    function Lot(dc_lot) {
        this.dc_lot = dc_lot;
        debug('Lot constructor');
        if (dc_lot === null) {
            throw new Error('dc_lot can not be null');
        }
    }
    Lot.prototype.toJson = function () {
        debug('toJson');
        return {
            state: this.getState(),
            text1: this.getText1(),
            text1Meaning: this.getText1Meaning(),
            text2: this.getText2(),
            timestamp: this.getTimestamp(),
        };
    };
    Lot.prototype.getId = function () {
        return binding.dcn_lot_get_id(this.dc_lot);
    };
    Lot.prototype.getState = function () {
        return binding.dcn_lot_get_state(this.dc_lot);
    };
    Lot.prototype.getText1 = function () {
        return binding.dcn_lot_get_text1(this.dc_lot);
    };
    Lot.prototype.getText1Meaning = function () {
        return binding.dcn_lot_get_text1_meaning(this.dc_lot);
    };
    Lot.prototype.getText2 = function () {
        return binding.dcn_lot_get_text2(this.dc_lot);
    };
    Lot.prototype.getTimestamp = function () {
        return binding.dcn_lot_get_timestamp(this.dc_lot);
    };
    return Lot;
}());
exports.Lot = Lot;
//# sourceMappingURL=lot.js.map