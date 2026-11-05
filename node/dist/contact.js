"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Contact = void 0;
var util_1 = require("./util");
/* eslint-disable camelcase */
var binding_1 = __importDefault(require("./binding"));
var debug = require('debug')('deltachat:node:contact');
/**
 * Wrapper around dc_contact_t*
 */
var Contact = /** @class */ (function () {
    function Contact(dc_contact) {
        this.dc_contact = dc_contact;
        debug('Contact constructor');
        if (dc_contact === null) {
            throw new Error('native contact can not be null');
        }
    }
    Contact.prototype.toJson = function () {
        debug('toJson');
        return {
            address: this.getAddress(),
            color: this.color,
            authName: this.authName,
            status: this.status,
            displayName: this.getDisplayName(),
            id: this.getId(),
            lastSeen: this.lastSeen,
            name: this.getName(),
            profileImage: this.getProfileImage(),
            nameAndAddr: this.getNameAndAddress(),
            isBlocked: this.isBlocked(),
            isVerified: this.isVerified(),
        };
    };
    Contact.prototype.getAddress = function () {
        return binding_1.default.dcn_contact_get_addr(this.dc_contact);
    };
    Object.defineProperty(Contact.prototype, "authName", {
        /** Get original contact name.
         * This is the name of the contact as defined by the contact themself.
         * If the contact themself does not define such a name,
         * an empty string is returned. */
        get: function () {
            return binding_1.default.dcn_contact_get_auth_name(this.dc_contact);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Contact.prototype, "color", {
        get: function () {
            return util_1.integerToHexColor(binding_1.default.dcn_contact_get_color(this.dc_contact));
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Contact.prototype, "status", {
        /**
         * contact's status
         *
         * Status is the last signature received in a message from this contact.
         */
        get: function () {
            return binding_1.default.dcn_contact_get_status(this.dc_contact);
        },
        enumerable: false,
        configurable: true
    });
    Contact.prototype.getDisplayName = function () {
        return binding_1.default.dcn_contact_get_display_name(this.dc_contact);
    };
    Contact.prototype.getId = function () {
        return binding_1.default.dcn_contact_get_id(this.dc_contact);
    };
    Object.defineProperty(Contact.prototype, "lastSeen", {
        get: function () {
            return binding_1.default.dcn_contact_get_last_seen(this.dc_contact);
        },
        enumerable: false,
        configurable: true
    });
    Contact.prototype.wasSeenRecently = function () {
        return Boolean(binding_1.default.dcn_contact_was_seen_recently(this.dc_contact));
    };
    Contact.prototype.getName = function () {
        return binding_1.default.dcn_contact_get_name(this.dc_contact);
    };
    Contact.prototype.getNameAndAddress = function () {
        return binding_1.default.dcn_contact_get_name_n_addr(this.dc_contact);
    };
    Contact.prototype.getProfileImage = function () {
        return binding_1.default.dcn_contact_get_profile_image(this.dc_contact);
    };
    Contact.prototype.isBlocked = function () {
        return Boolean(binding_1.default.dcn_contact_is_blocked(this.dc_contact));
    };
    Contact.prototype.isVerified = function () {
        return Boolean(binding_1.default.dcn_contact_is_verified(this.dc_contact));
    };
    return Contact;
}());
exports.Contact = Contact;
//# sourceMappingURL=contact.js.map