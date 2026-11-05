"use strict";
/* eslint-disable camelcase */
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Context = void 0;
var binding_1 = __importDefault(require("./binding"));
var constants_1 = require("./constants");
var chat_1 = require("./chat");
var chatlist_1 = require("./chatlist");
var contact_1 = require("./contact");
var message_1 = require("./message");
var lot_1 = require("./lot");
var locations_1 = require("./locations");
var debug_1 = __importDefault(require("debug"));
var deltachat_1 = require("./deltachat");
var path_1 = require("path");
var stream_1 = require("stream");
var debug = debug_1.default('deltachat:node:index');
var noop = function () { };
/**
 * Wrapper around dcn_context_t*
 *
 * only acts as event emitter when created in standalone mode (without account manager)
 * with `Context.open`
 */
var Context = /** @class */ (function (_super) {
    __extends(Context, _super);
    function Context(manager, inner_dcn_context, account_id) {
        var _this = _super.call(this) || this;
        _this.manager = manager;
        _this.inner_dcn_context = inner_dcn_context;
        _this.account_id = account_id;
        debug('DeltaChat constructor');
        if (inner_dcn_context === null) {
            throw new Error('inner_dcn_context can not be null');
        }
        return _this;
    }
    /** Opens a stanalone context (without an account manager)
     * automatically starts the event handler */
    Context.open = function (cwd) {
        var dbFile = path_1.join(cwd, 'db.sqlite');
        var context = new Context(null, binding_1.default.dcn_context_new(dbFile), null);
        debug('Opened context');
        function handleCoreEvent(eventId, data1, data2) {
            var eventString = constants_1.EventId2EventName[eventId];
            debug(eventString, data1, data2);
            if (!context.emit) {
                console.log('Received an event but EventEmitter is already destroyed.');
                console.log(eventString, data1, data2);
                return;
            }
            context.emit(eventString, data1, data2);
            context.emit('ALL', eventString, data1, data2);
        }
        binding_1.default.dcn_start_event_handler(context.dcn_context, handleCoreEvent.bind(this));
        debug('Started event handler');
        return context;
    };
    Object.defineProperty(Context.prototype, "dcn_context", {
        get: function () {
            return this.inner_dcn_context;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Context.prototype, "is_open", {
        get: function () {
            return Boolean(binding_1.default.dcn_context_is_open());
        },
        enumerable: false,
        configurable: true
    });
    Context.prototype.open = function (passphrase) {
        return Boolean(binding_1.default.dcn_context_open(this.dcn_context, passphrase ? passphrase : ''));
    };
    Context.prototype.unref = function () {
        binding_1.default.dcn_context_unref(this.dcn_context);
        this.inner_dcn_context = null;
    };
    Context.prototype.acceptChat = function (chatId) {
        binding_1.default.dcn_accept_chat(this.dcn_context, chatId);
    };
    Context.prototype.blockChat = function (chatId) {
        binding_1.default.dcn_block_chat(this.dcn_context, chatId);
    };
    Context.prototype.addAddressBook = function (addressBook) {
        debug("addAddressBook " + addressBook);
        return binding_1.default.dcn_add_address_book(this.dcn_context, addressBook);
    };
    Context.prototype.addContactToChat = function (chatId, contactId) {
        debug("addContactToChat " + chatId + " " + contactId);
        return Boolean(binding_1.default.dcn_add_contact_to_chat(this.dcn_context, Number(chatId), Number(contactId)));
    };
    Context.prototype.addDeviceMessage = function (label, msg) {
        debug("addDeviceMessage " + label + " " + msg);
        if (!msg) {
            throw new Error('invalid msg parameter');
        }
        if (typeof label !== 'string') {
            throw new Error('invalid label parameter, must be a string');
        }
        if (typeof msg === 'string') {
            var msgObj = this.messageNew();
            msgObj.setText(msg);
            msg = msgObj;
        }
        if (!msg.dc_msg) {
            throw new Error('invalid msg object');
        }
        return binding_1.default.dcn_add_device_msg(this.dcn_context, label, msg.dc_msg);
    };
    Context.prototype.setChatVisibility = function (chatId, visibility) {
        debug("setChatVisibility " + chatId + " " + visibility);
        binding_1.default.dcn_set_chat_visibility(this.dcn_context, Number(chatId), visibility);
    };
    Context.prototype.blockContact = function (contactId, block) {
        debug("blockContact " + contactId + " " + block);
        binding_1.default.dcn_block_contact(this.dcn_context, Number(contactId), block ? 1 : 0);
    };
    Context.prototype.checkQrCode = function (qrCode) {
        debug("checkQrCode " + qrCode);
        var dc_lot = binding_1.default.dcn_check_qr(this.dcn_context, qrCode);
        var result = dc_lot ? new lot_1.Lot(dc_lot) : null;
        if (result) {
            return __assign({ id: result.getId() }, result.toJson());
        }
        return result;
    };
    Context.prototype.configure = function (opts) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            debug('configure');
            var onSuccess = function () {
                removeListeners();
                resolve();
            };
            var onFail = function (error) {
                removeListeners();
                reject(new Error(error));
            };
            var onConfigure;
            if (_this.account_id === null) {
                onConfigure = function (data1, data2) {
                    if (data1 === 0)
                        return onFail(data2);
                    else if (data1 === 1000)
                        return onSuccess();
                };
            }
            else {
                onConfigure = function (accountId, data1, data2) {
                    if (_this.account_id !== accountId) {
                        return;
                    }
                    if (data1 === 0)
                        return onFail(data2);
                    else if (data1 === 1000)
                        return onSuccess();
                };
            }
            var removeListeners = function () {
                ;
                (_this.manager || _this).removeListener('DC_EVENT_CONFIGURE_PROGRESS', onConfigure);
            };
            var registerListeners = function () {
                ;
                (_this.manager || _this).on('DC_EVENT_CONFIGURE_PROGRESS', onConfigure);
            };
            registerListeners();
            if (!opts)
                opts = {};
            Object.keys(opts).forEach(function (key) {
                var value = opts[key];
                _this.setConfig(key, value);
            });
            binding_1.default.dcn_configure(_this.dcn_context);
        });
    };
    Context.prototype.continueKeyTransfer = function (messageId, setupCode) {
        var _this = this;
        debug("continueKeyTransfer " + messageId);
        return new Promise(function (resolve, reject) {
            binding_1.default.dcn_continue_key_transfer(_this.dcn_context, Number(messageId), setupCode, function (result) { return resolve(result === 1); });
        });
    };
    /** @returns chatId */
    Context.prototype.createBroadcastList = function () {
        debug("createBroadcastList");
        return binding_1.default.dcn_create_broadcast_list(this.dcn_context);
    };
    /** @returns chatId */
    Context.prototype.createChatByContactId = function (contactId) {
        debug("createChatByContactId " + contactId);
        return binding_1.default.dcn_create_chat_by_contact_id(this.dcn_context, Number(contactId));
    };
    /** @returns contactId */
    Context.prototype.createContact = function (name, addr) {
        debug("createContact " + name + " " + addr);
        return binding_1.default.dcn_create_contact(this.dcn_context, name, addr);
    };
    /**
     *
     * @param chatName The name of the chat that should be created
     * @param is_protected Whether the chat should be protected at creation time
     * @returns chatId
     */
    Context.prototype.createGroupChat = function (chatName, is_protected) {
        if (is_protected === void 0) { is_protected = false; }
        debug("createGroupChat " + chatName + " [protected:" + is_protected + "]");
        return binding_1.default.dcn_create_group_chat(this.dcn_context, is_protected ? 1 : 0, chatName);
    };
    Context.prototype.deleteChat = function (chatId) {
        debug("deleteChat " + chatId);
        binding_1.default.dcn_delete_chat(this.dcn_context, Number(chatId));
    };
    Context.prototype.deleteContact = function (contactId) {
        debug("deleteContact " + contactId);
        return Boolean(binding_1.default.dcn_delete_contact(this.dcn_context, Number(contactId)));
    };
    Context.prototype.deleteMessages = function (messageIds) {
        if (!Array.isArray(messageIds)) {
            messageIds = [messageIds];
        }
        messageIds = messageIds.map(function (id) { return Number(id); });
        debug('deleteMessages', messageIds);
        binding_1.default.dcn_delete_msgs(this.dcn_context, messageIds);
    };
    Context.prototype.forwardMessages = function (messageIds, chatId) {
        if (!Array.isArray(messageIds)) {
            messageIds = [messageIds];
        }
        messageIds = messageIds.map(function (id) { return Number(id); });
        debug('forwardMessages', messageIds);
        binding_1.default.dcn_forward_msgs(this.dcn_context, messageIds, chatId);
    };
    Context.prototype.getBlobdir = function () {
        debug('getBlobdir');
        return binding_1.default.dcn_get_blobdir(this.dcn_context);
    };
    Context.prototype.getBlockedCount = function () {
        debug('getBlockedCount');
        return binding_1.default.dcn_get_blocked_cnt(this.dcn_context);
    };
    Context.prototype.getBlockedContacts = function () {
        debug('getBlockedContacts');
        return binding_1.default.dcn_get_blocked_contacts(this.dcn_context);
    };
    Context.prototype.getChat = function (chatId) {
        debug("getChat " + chatId);
        var dc_chat = binding_1.default.dcn_get_chat(this.dcn_context, Number(chatId));
        return dc_chat ? new chat_1.Chat(dc_chat) : null;
    };
    Context.prototype.getChatContacts = function (chatId) {
        debug("getChatContacts " + chatId);
        return binding_1.default.dcn_get_chat_contacts(this.dcn_context, Number(chatId));
    };
    Context.prototype.getChatIdByContactId = function (contactId) {
        debug("getChatIdByContactId " + contactId);
        return binding_1.default.dcn_get_chat_id_by_contact_id(this.dcn_context, Number(contactId));
    };
    Context.prototype.getChatMedia = function (chatId, msgType1, msgType2, msgType3) {
        debug("getChatMedia " + chatId);
        return binding_1.default.dcn_get_chat_media(this.dcn_context, Number(chatId), msgType1, msgType2 || 0, msgType3 || 0);
    };
    Context.prototype.getMimeHeaders = function (messageId) {
        debug("getMimeHeaders " + messageId);
        return binding_1.default.dcn_get_mime_headers(this.dcn_context, Number(messageId));
    };
    Context.prototype.getChatlistItemSummary = function (chatId, messageId) {
        debug("getChatlistItemSummary " + chatId + " " + messageId);
        return new lot_1.Lot(binding_1.default.dcn_chatlist_get_summary2(this.dcn_context, chatId, messageId));
    };
    Context.prototype.getChatMessages = function (chatId, flags, marker1before) {
        debug("getChatMessages " + chatId + " " + flags + " " + marker1before);
        return binding_1.default.dcn_get_chat_msgs(this.dcn_context, Number(chatId), flags, marker1before);
    };
    /**
     * Get encryption info for a chat.
     * Get a multi-line encryption info, containing encryption preferences of all members.
     * Can be used to find out why messages sent to group are not encrypted.
     *
     * @param chatId ID of the chat to get the encryption info for.
     * @return Multi-line text, must be released using dc_str_unref() after usage.
     */
    Context.prototype.getChatEncrytionInfo = function (chatId) {
        return binding_1.default.dcn_get_chat_encrinfo(this.dcn_context, chatId);
    };
    Context.prototype.getChats = function (listFlags, queryStr, queryContactId) {
        debug('getChats');
        var result = [];
        var list = this.getChatList(listFlags, queryStr, queryContactId);
        var count = list.getCount();
        for (var i = 0; i < count; i++) {
            result.push(list.getChatId(i));
        }
        return result;
    };
    Context.prototype.getChatList = function (listFlags, queryStr, queryContactId) {
        listFlags = listFlags || 0;
        queryStr = queryStr || '';
        queryContactId = queryContactId || 0;
        debug("getChatList " + listFlags + " " + queryStr + " " + queryContactId);
        return new chatlist_1.ChatList(binding_1.default.dcn_get_chatlist(this.dcn_context, listFlags, queryStr, Number(queryContactId)));
    };
    Context.prototype.getConfig = function (key) {
        debug("getConfig " + key);
        return binding_1.default.dcn_get_config(this.dcn_context, key);
    };
    Context.prototype.getContact = function (contactId) {
        debug("getContact " + contactId);
        var dc_contact = binding_1.default.dcn_get_contact(this.dcn_context, Number(contactId));
        return dc_contact ? new contact_1.Contact(dc_contact) : null;
    };
    Context.prototype.getContactEncryptionInfo = function (contactId) {
        debug("getContactEncryptionInfo " + contactId);
        return binding_1.default.dcn_get_contact_encrinfo(this.dcn_context, Number(contactId));
    };
    Context.prototype.getContacts = function (listFlags, query) {
        listFlags = listFlags || 0;
        query = query || '';
        debug("getContacts " + listFlags + " " + query);
        return binding_1.default.dcn_get_contacts(this.dcn_context, listFlags, query);
    };
    Context.prototype.wasDeviceMessageEverAdded = function (label) {
        debug("wasDeviceMessageEverAdded " + label);
        var added = binding_1.default.dcn_was_device_msg_ever_added(this.dcn_context, label);
        return added === 1;
    };
    Context.prototype.getDraft = function (chatId) {
        debug("getDraft " + chatId);
        var dc_msg = binding_1.default.dcn_get_draft(this.dcn_context, Number(chatId));
        return dc_msg ? new message_1.Message(dc_msg) : null;
    };
    Context.prototype.getFreshMessageCount = function (chatId) {
        debug("getFreshMessageCount " + chatId);
        return binding_1.default.dcn_get_fresh_msg_cnt(this.dcn_context, Number(chatId));
    };
    Context.prototype.getFreshMessages = function () {
        debug('getFreshMessages');
        return binding_1.default.dcn_get_fresh_msgs(this.dcn_context);
    };
    Context.prototype.getInfo = function () {
        debug('getInfo');
        var info = binding_1.default.dcn_get_info(this.dcn_context);
        return deltachat_1.AccountManager.parseGetInfo(info);
    };
    Context.prototype.getMessage = function (messageId) {
        debug("getMessage " + messageId);
        var dc_msg = binding_1.default.dcn_get_msg(this.dcn_context, Number(messageId));
        return dc_msg ? new message_1.Message(dc_msg) : null;
    };
    Context.prototype.getMessageCount = function (chatId) {
        debug("getMessageCount " + chatId);
        return binding_1.default.dcn_get_msg_cnt(this.dcn_context, Number(chatId));
    };
    Context.prototype.getMessageInfo = function (messageId) {
        debug("getMessageInfo " + messageId);
        return binding_1.default.dcn_get_msg_info(this.dcn_context, Number(messageId));
    };
    Context.prototype.getMessageHTML = function (messageId) {
        debug("getMessageHTML " + messageId);
        return binding_1.default.dcn_get_msg_html(this.dcn_context, Number(messageId));
    };
    Context.prototype.getNextMediaMessage = function (messageId, msgType1, msgType2, msgType3) {
        debug("getNextMediaMessage " + messageId + " " + msgType1 + " " + msgType2 + " " + msgType3);
        return this._getNextMedia(messageId, 1, msgType1, msgType2, msgType3);
    };
    Context.prototype.getPreviousMediaMessage = function (messageId, msgType1, msgType2, msgType3) {
        debug("getPreviousMediaMessage " + messageId + " " + msgType1 + " " + msgType2 + " " + msgType3);
        return this._getNextMedia(messageId, -1, msgType1, msgType2, msgType3);
    };
    Context.prototype._getNextMedia = function (messageId, dir, msgType1, msgType2, msgType3) {
        return binding_1.default.dcn_get_next_media(this.dcn_context, Number(messageId), dir, msgType1 || 0, msgType2 || 0, msgType3 || 0);
    };
    Context.prototype.getSecurejoinQrCode = function (chatId) {
        debug("getSecurejoinQrCode " + chatId);
        return binding_1.default.dcn_get_securejoin_qr(this.dcn_context, Number(chatId));
    };
    Context.prototype.getSecurejoinQrCodeSVG = function (chatId) {
        debug("getSecurejoinQrCodeSVG " + chatId);
        return binding_1.default.dcn_get_securejoin_qr_svg(this.dcn_context, chatId);
    };
    Context.prototype.startIO = function () {
        debug("startIO");
        binding_1.default.dcn_start_io(this.dcn_context);
    };
    Context.prototype.stopIO = function () {
        debug("stopIO");
        binding_1.default.dcn_stop_io(this.dcn_context);
    };
    Context.prototype.stopOngoingProcess = function () {
        debug("stopOngoingProcess");
        binding_1.default.dcn_stop_ongoing_process(this.dcn_context);
    };
    /**
     *
     * @deprecated please use `AccountManager.getSystemInfo()` instead
     */
    Context.getSystemInfo = function () {
        return deltachat_1.AccountManager.getSystemInfo();
    };
    Context.prototype.getConnectivity = function () {
        return binding_1.default.dcn_get_connectivity(this.dcn_context);
    };
    Context.prototype.getConnectivityHTML = function () {
        return binding_1.default.dcn_get_connectivity_html(this.dcn_context);
    };
    Context.prototype.importExport = function (what, param1, param2) {
        if (param2 === void 0) { param2 = ''; }
        debug("importExport " + what + " " + param1 + " " + param2);
        binding_1.default.dcn_imex(this.dcn_context, what, param1, param2);
    };
    Context.prototype.importExportHasBackup = function (dir) {
        debug("importExportHasBackup " + dir);
        return binding_1.default.dcn_imex_has_backup(this.dcn_context, dir);
    };
    Context.prototype.initiateKeyTransfer = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            debug('initiateKeyTransfer2');
            binding_1.default.dcn_initiate_key_transfer(_this.dcn_context, resolve);
        });
    };
    Context.prototype.isConfigured = function () {
        debug('isConfigured');
        return Boolean(binding_1.default.dcn_is_configured(this.dcn_context));
    };
    Context.prototype.isContactInChat = function (chatId, contactId) {
        debug("isContactInChat " + chatId + " " + contactId);
        return Boolean(binding_1.default.dcn_is_contact_in_chat(this.dcn_context, Number(chatId), Number(contactId)));
    };
    /**
     *
     * @returns resulting chat id or 0 on error
     */
    Context.prototype.joinSecurejoin = function (qrCode) {
        debug("joinSecurejoin " + qrCode);
        return binding_1.default.dcn_join_securejoin(this.dcn_context, qrCode);
    };
    Context.prototype.lookupContactIdByAddr = function (addr) {
        debug("lookupContactIdByAddr " + addr);
        return binding_1.default.dcn_lookup_contact_id_by_addr(this.dcn_context, addr);
    };
    Context.prototype.markNoticedChat = function (chatId) {
        debug("markNoticedChat " + chatId);
        binding_1.default.dcn_marknoticed_chat(this.dcn_context, Number(chatId));
    };
    Context.prototype.markSeenMessages = function (messageIds) {
        if (!Array.isArray(messageIds)) {
            messageIds = [messageIds];
        }
        messageIds = messageIds.map(function (id) { return Number(id); });
        debug('markSeenMessages', messageIds);
        binding_1.default.dcn_markseen_msgs(this.dcn_context, messageIds);
    };
    Context.prototype.maybeNetwork = function () {
        debug('maybeNetwork');
        binding_1.default.dcn_maybe_network(this.dcn_context);
    };
    Context.prototype.messageNew = function (viewType) {
        if (viewType === void 0) { viewType = constants_1.C.DC_MSG_TEXT; }
        debug("messageNew " + viewType);
        return new message_1.Message(binding_1.default.dcn_msg_new(this.dcn_context, viewType));
    };
    Context.prototype.removeContactFromChat = function (chatId, contactId) {
        debug("removeContactFromChat " + chatId + " " + contactId);
        return Boolean(binding_1.default.dcn_remove_contact_from_chat(this.dcn_context, Number(chatId), Number(contactId)));
    };
    /**
     *
     * @param chatId 	ID of the chat to search messages in. Set this to 0 for a global search.
     * @param query The query to search for.
     */
    Context.prototype.searchMessages = function (chatId, query) {
        debug("searchMessages " + chatId + " " + query);
        return binding_1.default.dcn_search_msgs(this.dcn_context, Number(chatId), query);
    };
    Context.prototype.sendMessage = function (chatId, msg) {
        debug("sendMessage " + chatId);
        if (!msg) {
            throw new Error('invalid msg parameter');
        }
        if (typeof msg === 'string') {
            var msgObj = this.messageNew();
            msgObj.setText(msg);
            msg = msgObj;
        }
        if (!msg.dc_msg) {
            throw new Error('invalid msg object');
        }
        return binding_1.default.dcn_send_msg(this.dcn_context, Number(chatId), msg.dc_msg);
    };
    Context.prototype.downloadFullMessage = function (messageId) {
        binding_1.default.dcn_download_full_msg(this.dcn_context, messageId);
    };
    /**
     *
     * @returns {Promise<number>} Promise that resolves into the resulting message id
     */
    Context.prototype.sendVideochatInvitation = function (chatId) {
        var _this = this;
        debug("sendVideochatInvitation " + chatId);
        return new Promise(function (resolve, reject) {
            binding_1.default.dcn_send_videochat_invitation(_this.dcn_context, chatId, function (result) {
                if (result !== 0) {
                    resolve(result);
                }
                else {
                    reject('Videochatinvitation failed to send, see error events for detailed info');
                }
            });
        });
    };
    Context.prototype.setChatName = function (chatId, name) {
        debug("setChatName " + chatId + " " + name);
        return Boolean(binding_1.default.dcn_set_chat_name(this.dcn_context, Number(chatId), name));
    };
    /**
     *
     * @param chatId
     * @param protect
     * @returns success boolean
     */
    Context.prototype.setChatProtection = function (chatId, protect) {
        debug("setChatProtection " + chatId + " " + protect);
        return Boolean(binding_1.default.dcn_set_chat_protection(this.dcn_context, Number(chatId), protect ? 1 : 0));
    };
    Context.prototype.getChatEphemeralTimer = function (chatId) {
        debug("getChatEphemeralTimer " + chatId);
        return binding_1.default.dcn_get_chat_ephemeral_timer(this.dcn_context, Number(chatId));
    };
    Context.prototype.setChatEphemeralTimer = function (chatId, timer) {
        debug("setChatEphemeralTimer " + chatId + " " + timer);
        return Boolean(binding_1.default.dcn_set_chat_ephemeral_timer(this.dcn_context, Number(chatId), Number(timer)));
    };
    Context.prototype.setChatProfileImage = function (chatId, image) {
        debug("setChatProfileImage " + chatId + " " + image);
        return Boolean(binding_1.default.dcn_set_chat_profile_image(this.dcn_context, Number(chatId), image || ''));
    };
    Context.prototype.setConfig = function (key, value) {
        debug("setConfig (string) " + key + " " + value);
        if (value === null) {
            return binding_1.default.dcn_set_config_null(this.dcn_context, key);
        }
        else {
            if (typeof value === 'boolean') {
                value = value === true ? '1' : '0';
            }
            else if (typeof value === 'number') {
                value = String(value);
            }
            return binding_1.default.dcn_set_config(this.dcn_context, key, value);
        }
    };
    Context.prototype.setConfigFromQr = function (qrcodeContent) {
        return Boolean(binding_1.default.dcn_set_config_from_qr(this.dcn_context, qrcodeContent));
    };
    Context.prototype.estimateDeletionCount = function (fromServer, seconds) {
        debug("estimateDeletionCount fromServer: " + fromServer + " seconds: " + seconds);
        return binding_1.default.dcn_estimate_deletion_cnt(this.dcn_context, fromServer === true ? 1 : 0, seconds);
    };
    Context.prototype.setStockTranslation = function (stockId, stockMsg) {
        debug("setStockTranslation " + stockId + " " + stockMsg);
        return Boolean(binding_1.default.dcn_set_stock_translation(this.dcn_context, Number(stockId), stockMsg));
    };
    Context.prototype.setDraft = function (chatId, msg) {
        debug("setDraft " + chatId);
        binding_1.default.dcn_set_draft(this.dcn_context, Number(chatId), msg ? msg.dc_msg : null);
    };
    Context.prototype.setLocation = function (latitude, longitude, accuracy) {
        debug("setLocation " + latitude);
        binding_1.default.dcn_set_location(this.dcn_context, Number(latitude), Number(longitude), Number(accuracy));
    };
    /*
     * @param chatId Chat-id to get location information for.
     *     0 to get locations independently of the chat.
     * @param contactId Contact id to get location information for.
     *     If also a chat-id is given, this should be a member of the given chat.
     *     0 to get locations independently of the contact.
     * @param timestampFrom Start of timespan to return.
     *     Must be given in number of seconds since 00:00 hours, Jan 1, 1970 UTC.
     *     0 for "start from the beginning".
     * @param timestampTo End of timespan to return.
     *     Must be given in number of seconds since 00:00 hours, Jan 1, 1970 UTC.
     *     0 for "all up to now".
     * @return Array of locations, NULL is never returned.
     *     The array is sorted descending;
     *     the first entry in the array is the location with the newest timestamp.
     *
     * Examples:
     * // get locations from the last hour for a global map
     * getLocations(0, 0, time(NULL)-60*60, 0);
     *
     * // get locations from a contact for a global map
     * getLocations(0, contact_id, 0, 0);
     *
     * // get all locations known for a given chat
     * getLocations(chat_id, 0, 0, 0);
     *
     * // get locations from a single contact for a given chat
     * getLocations(chat_id, contact_id, 0, 0);
     */
    Context.prototype.getLocations = function (chatId, contactId, timestampFrom, timestampTo) {
        if (timestampFrom === void 0) { timestampFrom = 0; }
        if (timestampTo === void 0) { timestampTo = 0; }
        var locations = new locations_1.Locations(binding_1.default.dcn_get_locations(this.dcn_context, Number(chatId), Number(contactId), timestampFrom, timestampTo));
        return locations.toJson();
    };
    /**
     *
     * @param duration The duration (0 for no mute, -1 for forever mute, everything else is is the relative mute duration from now in seconds)
     */
    Context.prototype.setChatMuteDuration = function (chatId, duration) {
        return Boolean(binding_1.default.dcn_set_chat_mute_duration(this.dcn_context, chatId, duration));
    };
    /** get information about the provider */
    Context.prototype.getProviderFromEmail = function (email) {
        debug('DeltaChat.getProviderFromEmail');
        var provider = binding_1.default.dcn_provider_new_from_email(this.dcn_context, email);
        if (!provider) {
            return undefined;
        }
        return {
            before_login_hint: binding_1.default.dcn_provider_get_before_login_hint(provider),
            overview_page: binding_1.default.dcn_provider_get_overview_page(provider),
            status: binding_1.default.dcn_provider_get_status(provider),
        };
    };
    Context.prototype.sendWebxdcStatusUpdate = function (msgId, json, descr) {
        return Boolean(binding_1.default.dcn_send_webxdc_status_update(this.dcn_context, msgId, JSON.stringify(json), descr));
    };
    Context.prototype.getWebxdcStatusUpdates = function (msgId, serial) {
        if (serial === void 0) { serial = 0; }
        return JSON.parse(binding_1.default.dcn_get_webxdc_status_updates(this.dcn_context, msgId, serial));
    };
    /** the string contains the binary data, it is an "u8 string", maybe we will use a more efficient type in the future. */
    Context.prototype.getWebxdcBlob = function (message, filename) {
        return binding_1.default.dcn_msg_get_webxdc_blob(message.dc_msg, filename);
    };
    return Context;
}(stream_1.EventEmitter));
exports.Context = Context;
//# sourceMappingURL=context.js.map