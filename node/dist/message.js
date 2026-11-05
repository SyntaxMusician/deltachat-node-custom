"use strict";
/* eslint-disable camelcase */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Message = exports.MessageViewType = exports.MessageState = exports.MessageDownloadState = void 0;
var binding_1 = __importDefault(require("./binding"));
var constants_1 = require("./constants");
var lot_1 = require("./lot");
var debug = require('debug')('deltachat:node:message');
var MessageDownloadState;
(function (MessageDownloadState) {
    MessageDownloadState[MessageDownloadState["Available"] = 10] = "Available";
    MessageDownloadState[MessageDownloadState["Done"] = 0] = "Done";
    MessageDownloadState[MessageDownloadState["Failure"] = 20] = "Failure";
    MessageDownloadState[MessageDownloadState["InProgress"] = 1000] = "InProgress";
})(MessageDownloadState = exports.MessageDownloadState || (exports.MessageDownloadState = {}));
/**
 * Helper class for message states so you can do e.g.
 *
 * if (msg.getState().isPending()) { .. }
 *
 */
var MessageState = /** @class */ (function () {
    function MessageState(state) {
        this.state = state;
        debug("MessageState constructor " + state);
    }
    MessageState.prototype.isUndefined = function () {
        return this.state === constants_1.C.DC_STATE_UNDEFINED;
    };
    MessageState.prototype.isFresh = function () {
        return this.state === constants_1.C.DC_STATE_IN_FRESH;
    };
    MessageState.prototype.isNoticed = function () {
        return this.state === constants_1.C.DC_STATE_IN_NOTICED;
    };
    MessageState.prototype.isSeen = function () {
        return this.state === constants_1.C.DC_STATE_IN_SEEN;
    };
    MessageState.prototype.isPending = function () {
        return this.state === constants_1.C.DC_STATE_OUT_PENDING;
    };
    MessageState.prototype.isFailed = function () {
        return this.state === constants_1.C.DC_STATE_OUT_FAILED;
    };
    MessageState.prototype.isDelivered = function () {
        return this.state === constants_1.C.DC_STATE_OUT_DELIVERED;
    };
    MessageState.prototype.isReceived = function () {
        return this.state === constants_1.C.DC_STATE_OUT_MDN_RCVD;
    };
    return MessageState;
}());
exports.MessageState = MessageState;
/**
 * Helper class for message types so you can do e.g.
 *
 * if (msg.getViewType().isVideo()) { .. }
 *
 */
var MessageViewType = /** @class */ (function () {
    function MessageViewType(viewType) {
        this.viewType = viewType;
        debug("MessageViewType constructor " + viewType);
    }
    MessageViewType.prototype.isText = function () {
        return this.viewType === constants_1.C.DC_MSG_TEXT;
    };
    MessageViewType.prototype.isImage = function () {
        return this.viewType === constants_1.C.DC_MSG_IMAGE || this.viewType === constants_1.C.DC_MSG_GIF;
    };
    MessageViewType.prototype.isGif = function () {
        return this.viewType === constants_1.C.DC_MSG_GIF;
    };
    MessageViewType.prototype.isAudio = function () {
        return this.viewType === constants_1.C.DC_MSG_AUDIO || this.viewType === constants_1.C.DC_MSG_VOICE;
    };
    MessageViewType.prototype.isVoice = function () {
        return this.viewType === constants_1.C.DC_MSG_VOICE;
    };
    MessageViewType.prototype.isVideo = function () {
        return this.viewType === constants_1.C.DC_MSG_VIDEO;
    };
    MessageViewType.prototype.isFile = function () {
        return this.viewType === constants_1.C.DC_MSG_FILE;
    };
    MessageViewType.prototype.isVideochatInvitation = function () {
        return this.viewType === constants_1.C.DC_MSG_VIDEOCHAT_INVITATION;
    };
    return MessageViewType;
}());
exports.MessageViewType = MessageViewType;
/**
 * Wrapper around dc_msg_t*
 */
var Message = /** @class */ (function () {
    function Message(dc_msg) {
        this.dc_msg = dc_msg;
        debug('Message constructor');
        if (dc_msg === null) {
            throw new Error('dc_msg can not be null');
        }
    }
    Message.prototype.toJson = function () {
        var _a;
        debug('toJson');
        var quotedMessage = this.getQuotedMessage();
        var viewType = binding_1.default.dcn_msg_get_viewtype(this.dc_msg);
        return {
            chatId: this.getChatId(),
            webxdcInfo: viewType == constants_1.C.DC_MSG_WEBXDC ? this.webxdcInfo : null,
            downloadState: this.downloadState,
            duration: this.getDuration(),
            file: this.getFile(),
            fromId: this.getFromId(),
            id: this.getId(),
            quotedText: this.getQuotedText(),
            quotedMessageId: quotedMessage ? quotedMessage.getId() : null,
            receivedTimestamp: this.getReceivedTimestamp(),
            sortTimestamp: this.getSortTimestamp(),
            text: this.getText(),
            timestamp: this.getTimestamp(),
            hasLocation: this.hasLocation(),
            hasHTML: this.hasHTML,
            viewType: viewType,
            state: binding_1.default.dcn_msg_get_state(this.dc_msg),
            hasDeviatingTimestamp: this.hasDeviatingTimestamp(),
            showPadlock: this.getShowpadlock(),
            summary: this.getSummary().toJson(),
            subject: this.subject,
            isSetupmessage: this.isSetupmessage(),
            isInfo: this.isInfo(),
            isForwarded: this.isForwarded(),
            dimensions: {
                height: this.getHeight(),
                width: this.getWidth(),
            },
            videochatType: this.getVideochatType(),
            videochatUrl: this.getVideochatUrl(),
            overrideSenderName: this.overrideSenderName,
            parentId: (_a = this.parent) === null || _a === void 0 ? void 0 : _a.getId(),
        };
    };
    Message.prototype.getChatId = function () {
        return binding_1.default.dcn_msg_get_chat_id(this.dc_msg);
    };
    Object.defineProperty(Message.prototype, "webxdcInfo", {
        get: function () {
            var info = binding_1.default.dcn_msg_get_webxdc_info(this.dc_msg);
            return info
                ? JSON.parse(binding_1.default.dcn_msg_get_webxdc_info(this.dc_msg))
                : null;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Message.prototype, "downloadState", {
        get: function () {
            return binding_1.default.dcn_msg_get_download_state(this.dc_msg);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Message.prototype, "parent", {
        get: function () {
            var msg = binding_1.default.dcn_msg_get_parent(this.dc_msg);
            return msg ? new Message(msg) : null;
        },
        enumerable: false,
        configurable: true
    });
    Message.prototype.getDuration = function () {
        return binding_1.default.dcn_msg_get_duration(this.dc_msg);
    };
    Message.prototype.getFile = function () {
        return binding_1.default.dcn_msg_get_file(this.dc_msg);
    };
    Message.prototype.getFilebytes = function () {
        return binding_1.default.dcn_msg_get_filebytes(this.dc_msg);
    };
    Message.prototype.getFilemime = function () {
        return binding_1.default.dcn_msg_get_filemime(this.dc_msg);
    };
    Message.prototype.getFilename = function () {
        return binding_1.default.dcn_msg_get_filename(this.dc_msg);
    };
    Message.prototype.getFromId = function () {
        return binding_1.default.dcn_msg_get_from_id(this.dc_msg);
    };
    Message.prototype.getHeight = function () {
        return binding_1.default.dcn_msg_get_height(this.dc_msg);
    };
    Message.prototype.getId = function () {
        return binding_1.default.dcn_msg_get_id(this.dc_msg);
    };
    Message.prototype.getQuotedText = function () {
        return binding_1.default.dcn_msg_get_quoted_text(this.dc_msg);
    };
    Message.prototype.getQuotedMessage = function () {
        var dc_msg = binding_1.default.dcn_msg_get_quoted_msg(this.dc_msg);
        return dc_msg ? new Message(dc_msg) : null;
    };
    Message.prototype.getReceivedTimestamp = function () {
        return binding_1.default.dcn_msg_get_received_timestamp(this.dc_msg);
    };
    Message.prototype.getSetupcodebegin = function () {
        return binding_1.default.dcn_msg_get_setupcodebegin(this.dc_msg);
    };
    Message.prototype.getShowpadlock = function () {
        return Boolean(binding_1.default.dcn_msg_get_showpadlock(this.dc_msg));
    };
    Message.prototype.getSortTimestamp = function () {
        return binding_1.default.dcn_msg_get_sort_timestamp(this.dc_msg);
    };
    Message.prototype.getState = function () {
        return new MessageState(binding_1.default.dcn_msg_get_state(this.dc_msg));
    };
    Message.prototype.getSummary = function (chat) {
        var dc_chat = (chat && chat.dc_chat) || null;
        return new lot_1.Lot(binding_1.default.dcn_msg_get_summary(this.dc_msg, dc_chat));
    };
    Object.defineProperty(Message.prototype, "subject", {
        get: function () {
            return binding_1.default.dcn_msg_get_subject(this.dc_msg);
        },
        enumerable: false,
        configurable: true
    });
    Message.prototype.getSummarytext = function (approxCharacters) {
        approxCharacters = approxCharacters || 0;
        return binding_1.default.dcn_msg_get_summarytext(this.dc_msg, approxCharacters);
    };
    Message.prototype.getText = function () {
        return binding_1.default.dcn_msg_get_text(this.dc_msg);
    };
    Message.prototype.getTimestamp = function () {
        return binding_1.default.dcn_msg_get_timestamp(this.dc_msg);
    };
    Message.prototype.getViewType = function () {
        return new MessageViewType(binding_1.default.dcn_msg_get_viewtype(this.dc_msg));
    };
    Message.prototype.getVideochatType = function () {
        return binding_1.default.dcn_msg_get_videochat_type(this.dc_msg);
    };
    Message.prototype.getVideochatUrl = function () {
        return binding_1.default.dcn_msg_get_videochat_url(this.dc_msg);
    };
    Message.prototype.getWidth = function () {
        return binding_1.default.dcn_msg_get_width(this.dc_msg);
    };
    Object.defineProperty(Message.prototype, "overrideSenderName", {
        get: function () {
            return binding_1.default.dcn_msg_get_override_sender_name(this.dc_msg);
        },
        enumerable: false,
        configurable: true
    });
    Message.prototype.hasDeviatingTimestamp = function () {
        return binding_1.default.dcn_msg_has_deviating_timestamp(this.dc_msg);
    };
    Message.prototype.hasLocation = function () {
        return Boolean(binding_1.default.dcn_msg_has_location(this.dc_msg));
    };
    Object.defineProperty(Message.prototype, "hasHTML", {
        get: function () {
            return Boolean(binding_1.default.dcn_msg_has_html(this.dc_msg));
        },
        enumerable: false,
        configurable: true
    });
    Message.prototype.isDeadDrop = function () {
        // TODO: Fix
        //return this.getChatId() === C.DC_CHAT_ID_DEADDROP
        return false;
    };
    Message.prototype.isForwarded = function () {
        return Boolean(binding_1.default.dcn_msg_is_forwarded(this.dc_msg));
    };
    Message.prototype.isIncreation = function () {
        return Boolean(binding_1.default.dcn_msg_is_increation(this.dc_msg));
    };
    Message.prototype.isInfo = function () {
        return Boolean(binding_1.default.dcn_msg_is_info(this.dc_msg));
    };
    Message.prototype.isSent = function () {
        return Boolean(binding_1.default.dcn_msg_is_sent(this.dc_msg));
    };
    Message.prototype.isSetupmessage = function () {
        return Boolean(binding_1.default.dcn_msg_is_setupmessage(this.dc_msg));
    };
    Message.prototype.latefilingMediasize = function (width, height, duration) {
        binding_1.default.dcn_msg_latefiling_mediasize(this.dc_msg, width, height, duration);
    };
    Message.prototype.setDimension = function (width, height) {
        binding_1.default.dcn_msg_set_dimension(this.dc_msg, width, height);
        return this;
    };
    Message.prototype.setDuration = function (duration) {
        binding_1.default.dcn_msg_set_duration(this.dc_msg, duration);
        return this;
    };
    Message.prototype.setFile = function (file, mime) {
        if (typeof file !== 'string')
            throw new Error('Missing filename');
        binding_1.default.dcn_msg_set_file(this.dc_msg, file, mime || '');
        return this;
    };
    Message.prototype.setLocation = function (longitude, latitude) {
        binding_1.default.dcn_msg_set_location(this.dc_msg, longitude, latitude);
        return this;
    };
    Message.prototype.setQuote = function (quotedMessage) {
        binding_1.default.dcn_msg_set_quote(this.dc_msg, quotedMessage === null || quotedMessage === void 0 ? void 0 : quotedMessage.dc_msg);
        return this;
    };
    Message.prototype.setText = function (text) {
        binding_1.default.dcn_msg_set_text(this.dc_msg, text);
        return this;
    };
    Message.prototype.setHTML = function (html) {
        binding_1.default.dcn_msg_set_html(this.dc_msg, html);
        return this;
    };
    Message.prototype.setOverrideSenderName = function (senderName) {
        binding_1.default.dcn_msg_set_override_sender_name(this.dc_msg, senderName);
        return this;
    };
    /** Force the message to be sent in plain text.
     *
     * This API is for bots, there is no need to expose it in the UI.
     */
    Message.prototype.forcePlaintext = function () {
        binding_1.default.dcn_msg_force_plaintext(this.dc_msg);
    };
    return Message;
}());
exports.Message = Message;
//# sourceMappingURL=message.js.map