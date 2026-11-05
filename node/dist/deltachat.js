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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountManager = void 0;
var binding_1 = __importDefault(require("./binding"));
var constants_1 = require("./constants");
var events_1 = require("events");
var fs_1 = require("fs");
var debug_1 = __importDefault(require("debug"));
var os_1 = require("os");
var path_1 = require("path");
var context_1 = require("./context");
var debug = debug_1.default('deltachat:node:index');
var noop = function () { };
/**
 * Wrapper around dcn_account_t*
 */
var AccountManager = /** @class */ (function (_super) {
    __extends(AccountManager, _super);
    function AccountManager(cwd, os) {
        if (os === void 0) { os = 'deltachat-node'; }
        var _this = _super.call(this) || this;
        _this.jsonRpcStarted = false;
        debug('DeltaChat constructor');
        _this.accountDir = cwd;
        _this.dcn_accounts = binding_1.default.dcn_accounts_new(os, _this.accountDir);
        return _this;
    }
    AccountManager.prototype.getAllAccountIds = function () {
        return binding_1.default.dcn_accounts_get_all(this.dcn_accounts);
    };
    AccountManager.prototype.selectAccount = function (account_id) {
        return binding_1.default.dcn_accounts_select_account(this.dcn_accounts, account_id);
    };
    AccountManager.prototype.selectedAccount = function () {
        return binding_1.default.dcn_accounts_get_selected_account(this.dcn_accounts);
    };
    AccountManager.prototype.addAccount = function () {
        return binding_1.default.dcn_accounts_add_account(this.dcn_accounts);
    };
    AccountManager.prototype.addClosedAccount = function () {
        return binding_1.default.dcn_accounts_add_closed_account(this.dcn_accounts);
    };
    AccountManager.prototype.removeAccount = function (account_id) {
        return binding_1.default.dcn_accounts_remove_account(this.dcn_accounts, account_id);
    };
    AccountManager.prototype.accountContext = function (account_id) {
        var native_context = binding_1.default.dcn_accounts_get_account(this.dcn_accounts, account_id);
        if (native_context === null) {
            throw new Error("could not get context with id " + account_id + ", does it even exist? please check your ids");
        }
        return new context_1.Context(this, native_context, account_id);
    };
    AccountManager.prototype.migrateAccount = function (dbfile) {
        return binding_1.default.dcn_accounts_migrate_account(this.dcn_accounts, dbfile);
    };
    AccountManager.prototype.close = function () {
        this.stopIO();
        debug('unrefing context');
        binding_1.default.dcn_accounts_unref(this.dcn_accounts);
        debug('Unref end');
    };
    AccountManager.prototype.emit = function (event, account_id, data1, data2) {
        _super.prototype.emit.call(this, 'ALL', event, account_id, data1, data2);
        return _super.prototype.emit.call(this, event, account_id, data1, data2);
    };
    AccountManager.prototype.handleCoreEvent = function (eventId, accountId, data1, data2) {
        var eventString = constants_1.EventId2EventName[eventId];
        debug('event', eventString, accountId, data1, data2);
        debug(eventString, data1, data2);
        if (!this.emit) {
            console.log('Received an event but EventEmitter is already destroyed.');
            console.log(eventString, data1, data2);
            return;
        }
        this.emit(eventString, accountId, data1, data2);
    };
    AccountManager.prototype.startEvents = function () {
        if (this.dcn_accounts === null) {
            throw new Error('dcn_account is null');
        }
        binding_1.default.dcn_accounts_start_event_handler(this.dcn_accounts, this.handleCoreEvent.bind(this));
        debug('Started event handler');
    };
    AccountManager.prototype.startJsonRpcHandler = function (callback) {
        if (this.dcn_accounts === null) {
            throw new Error('dcn_account is null');
        }
        if (!callback) {
            throw new Error('no callback set');
        }
        if (this.jsonRpcStarted) {
            throw new Error('jsonrpc was started already');
        }
        binding_1.default.dcn_accounts_start_jsonrpc(this.dcn_accounts, callback.bind(this));
        debug('Started JSON-RPC handler');
        this.jsonRpcStarted = true;
    };
    AccountManager.prototype.jsonRpcRequest = function (message) {
        if (!this.jsonRpcStarted) {
            throw new Error('jsonrpc is not active, start it with startJsonRpcHandler first');
        }
        binding_1.default.dcn_json_rpc_request(this.dcn_accounts, message);
    };
    AccountManager.prototype.startIO = function () {
        binding_1.default.dcn_accounts_start_io(this.dcn_accounts);
    };
    AccountManager.prototype.stopIO = function () {
        binding_1.default.dcn_accounts_stop_io(this.dcn_accounts);
    };
    AccountManager.maybeValidAddr = function (addr) {
        debug('DeltaChat.maybeValidAddr');
        if (addr === null)
            return false;
        return Boolean(binding_1.default.dcn_maybe_valid_addr(addr));
    };
    AccountManager.parseGetInfo = function (info) {
        debug('static _getInfo');
        var result = {};
        var regex = /^(\w+)=(.*)$/i;
        info
            .split('\n')
            .filter(Boolean)
            .forEach(function (line) {
            var match = regex.exec(line);
            if (match) {
                result[match[1]] = match[2];
            }
        });
        return result;
    };
    AccountManager.newTemporary = function () {
        var directory = null;
        while (true) {
            var randomString = Math.random().toString(36).substr(2, 5);
            directory = path_1.join(os_1.tmpdir(), 'deltachat-' + randomString);
            if (!fs_1.existsSync(directory))
                break;
        }
        var dc = new AccountManager(directory);
        var accountId = dc.addAccount();
        var context = dc.accountContext(accountId);
        return { dc: dc, context: context, accountId: accountId, directory: directory };
    };
    AccountManager.getSystemInfo = function () {
        debug('DeltaChat.getSystemInfo');
        var _a = AccountManager.newTemporary(), dc = _a.dc, context = _a.context;
        var info = AccountManager.parseGetInfo(binding_1.default.dcn_get_info(context.dcn_context));
        var deltachat_core_version = info.deltachat_core_version, sqlite_version = info.sqlite_version, sqlite_thread_safe = info.sqlite_thread_safe, libetpan_version = info.libetpan_version, openssl_version = info.openssl_version, compile_date = info.compile_date, arch = info.arch;
        var result = {
            deltachat_core_version: deltachat_core_version,
            sqlite_version: sqlite_version,
            sqlite_thread_safe: sqlite_thread_safe,
            libetpan_version: libetpan_version,
            openssl_version: openssl_version,
            compile_date: compile_date,
            arch: arch,
        };
        context.unref();
        dc.close();
        return result;
    };
    /** get information about the provider
     *
     * This function creates a temporary context to be standalone,
     * if possible use `Context.getProviderFromEmail` instead. (otherwise potential proxy settings are not used)
     * @deprecated
     */
    AccountManager.getProviderFromEmail = function (email) {
        debug('DeltaChat.getProviderFromEmail');
        var _a = AccountManager.newTemporary(), dc = _a.dc, context = _a.context;
        var provider = context.getProviderFromEmail(email);
        context.unref();
        dc.close();
        return provider;
    };
    return AccountManager;
}(events_1.EventEmitter));
exports.AccountManager = AccountManager;
//# sourceMappingURL=deltachat.js.map