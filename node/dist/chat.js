"use strict";
/* eslint-disable camelcase */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Chat = void 0;
var binding_1 = __importDefault(require("./binding"));
var debug_1 = __importDefault(require("debug"));
var debug = debug_1.default('deltachat:node:chat');
var constants_1 = require("./constants");
var util_1 = require("./util");
/**
 * Wrapper around dc_chat_t*
 */
var Chat = /** @class */ (function () {
    function Chat(dc_chat) {
        this.dc_chat = dc_chat;
        debug('Chat constructor');
        if (dc_chat === null) {
            throw new Error('native chat can not be null');
        }
    }
    Chat.prototype.getVisibility = function () {
        return binding_1.default.dcn_chat_get_visibility(this.dc_chat);
    };
    Object.defineProperty(Chat.prototype, "color", {
        get: function () {
            return util_1.integerToHexColor(binding_1.default.dcn_chat_get_color(this.dc_chat));
        },
        enumerable: false,
        configurable: true
    });
    Chat.prototype.getId = function () {
        return binding_1.default.dcn_chat_get_id(this.dc_chat);
    };
    Chat.prototype.getName = function () {
        return binding_1.default.dcn_chat_get_name(this.dc_chat);
    };
    Chat.prototype.getMailinglistAddr = function () {
        return binding_1.default.dcn_chat_get_mailinglist_addr(this.dc_chat);
    };
    Chat.prototype.getProfileImage = function () {
        return binding_1.default.dcn_chat_get_profile_image(this.dc_chat);
    };
    Chat.prototype.getType = function () {
        return binding_1.default.dcn_chat_get_type(this.dc_chat);
    };
    Chat.prototype.isSelfTalk = function () {
        return Boolean(binding_1.default.dcn_chat_is_self_talk(this.dc_chat));
    };
    Chat.prototype.isContactRequest = function () {
        return Boolean(binding_1.default.dcn_chat_is_contact_request(this.dc_chat));
    };
    Chat.prototype.isUnpromoted = function () {
        return Boolean(binding_1.default.dcn_chat_is_unpromoted(this.dc_chat));
    };
    Chat.prototype.isProtected = function () {
        return Boolean(binding_1.default.dcn_chat_is_protected(this.dc_chat));
    };
    Object.defineProperty(Chat.prototype, "canSend", {
        get: function () {
            return Boolean(binding_1.default.dcn_chat_can_send(this.dc_chat));
        },
        enumerable: false,
        configurable: true
    });
    Chat.prototype.isDeviceTalk = function () {
        return Boolean(binding_1.default.dcn_chat_is_device_talk(this.dc_chat));
    };
    Chat.prototype.isSingle = function () {
        return this.getType() === constants_1.C.DC_CHAT_TYPE_SINGLE;
    };
    Chat.prototype.isGroup = function () {
        return this.getType() === constants_1.C.DC_CHAT_TYPE_GROUP;
    };
    Chat.prototype.isMuted = function () {
        return Boolean(binding_1.default.dcn_chat_is_muted(this.dc_chat));
    };
    Chat.prototype.toJson = function () {
        debug('toJson');
        var visibility = this.getVisibility();
        return {
            archived: visibility === constants_1.C.DC_CHAT_VISIBILITY_ARCHIVED,
            pinned: visibility === constants_1.C.DC_CHAT_VISIBILITY_PINNED,
            color: this.color,
            id: this.getId(),
            name: this.getName(),
            mailinglistAddr: this.getMailinglistAddr(),
            profileImage: this.getProfileImage(),
            type: this.getType(),
            isSelfTalk: this.isSelfTalk(),
            isUnpromoted: this.isUnpromoted(),
            isProtected: this.isProtected(),
            canSend: this.canSend,
            isDeviceTalk: this.isDeviceTalk(),
            isContactRequest: this.isContactRequest(),
            muted: this.isMuted(),
        };
    };
    return Chat;
}());
exports.Chat = Chat;
//# sourceMappingURL=chat.js.map