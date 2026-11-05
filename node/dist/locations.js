"use strict";
/* eslint-disable camelcase */
Object.defineProperty(exports, "__esModule", { value: true });
exports.Locations = void 0;
var binding = require('../binding');
var debug = require('debug')('deltachat:node:locations');
/**
 * Wrapper around dc_location_t*
 */
var Locations = /** @class */ (function () {
    function Locations(dc_locations) {
        this.dc_locations = dc_locations;
        debug('Locations constructor');
        if (dc_locations === null) {
            throw new Error('dc_locations can not be null');
        }
    }
    Locations.prototype.locationToJson = function (index) {
        debug('locationToJson');
        return {
            accuracy: this.getAccuracy(index),
            latitude: this.getLatitude(index),
            longitude: this.getLongitude(index),
            timestamp: this.getTimestamp(index),
            contactId: this.getContactId(index),
            msgId: this.getMsgId(index),
            chatId: this.getChatId(index),
            isIndependent: this.isIndependent(index),
            marker: this.getMarker(index),
        };
    };
    Locations.prototype.toJson = function () {
        debug('toJson');
        var locations = [];
        var count = this.getCount();
        for (var index = 0; index < count; index++) {
            locations.push(this.locationToJson(index));
        }
        return locations;
    };
    Locations.prototype.getCount = function () {
        return binding.dcn_array_get_cnt(this.dc_locations);
    };
    Locations.prototype.getAccuracy = function (index) {
        return binding.dcn_array_get_accuracy(this.dc_locations, index);
    };
    Locations.prototype.getLatitude = function (index) {
        return binding.dcn_array_get_latitude(this.dc_locations, index);
    };
    Locations.prototype.getLongitude = function (index) {
        return binding.dcn_array_get_longitude(this.dc_locations, index);
    };
    Locations.prototype.getTimestamp = function (index) {
        return binding.dcn_array_get_timestamp(this.dc_locations, index);
    };
    Locations.prototype.getMsgId = function (index) {
        return binding.dcn_array_get_msg_id(this.dc_locations, index);
    };
    Locations.prototype.getContactId = function (index) {
        return binding.dcn_array_get_contact_id(this.dc_locations, index);
    };
    Locations.prototype.getChatId = function (index) {
        return binding.dcn_array_get_chat_id(this.dc_locations, index);
    };
    Locations.prototype.isIndependent = function (index) {
        return binding.dcn_array_is_independent(this.dc_locations, index);
    };
    Locations.prototype.getMarker = function (index) {
        return binding.dcn_array_get_marker(this.dc_locations, index);
    };
    return Locations;
}());
exports.Locations = Locations;
//# sourceMappingURL=locations.js.map