"use strict";
/* eslint-disable camelcase */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatList = void 0;
var binding_1 = __importDefault(require("./binding"));
var lot_1 = require("./lot");
var debug = require('debug')('deltachat:node:chatlist');
/**
 * Wrapper around dc_chatlist_t*
 */
var ChatList = /** @class */ (function () {
    function ChatList(dc_chatlist) {
        this.dc_chatlist = dc_chatlist;
        debug('ChatList constructor');
        if (dc_chatlist === null) {
            throw new Error('native chat list can not be null');
        }
    }
    ChatList.prototype.getChatId = function (index) {
        debug("getChatId " + index);
        return binding_1.default.dcn_chatlist_get_chat_id(this.dc_chatlist, index);
    };
    ChatList.prototype.getCount = function () {
        debug('getCount');
        return binding_1.default.dcn_chatlist_get_cnt(this.dc_chatlist);
    };
    ChatList.prototype.getMessageId = function (index) {
        debug("getMessageId " + index);
        return binding_1.default.dcn_chatlist_get_msg_id(this.dc_chatlist, index);
    };
    ChatList.prototype.getSummary = function (index, chat) {
        debug("getSummary " + index);
        var dc_chat = (chat && chat.dc_chat) || null;
        return new lot_1.Lot(binding_1.default.dcn_chatlist_get_summary(this.dc_chatlist, index, dc_chat));
    };
    return ChatList;
}());
exports.ChatList = ChatList;
//# sourceMappingURL=chatlist.js.map