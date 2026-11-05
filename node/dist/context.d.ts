/// <reference types="node" />
import { C } from './constants';
import { Chat } from './chat';
import { ChatList } from './chatlist';
import { Contact } from './contact';
import { Message } from './message';
import { Lot } from './lot';
import { AccountManager } from './deltachat';
import { EventEmitter } from 'stream';
interface NativeContext {
}
/**
 * Wrapper around dcn_context_t*
 *
 * only acts as event emitter when created in standalone mode (without account manager)
 * with `Context.open`
 */
export declare class Context extends EventEmitter {
    readonly manager: AccountManager | null;
    private inner_dcn_context;
    readonly account_id: number | null;
    constructor(manager: AccountManager | null, inner_dcn_context: NativeContext, account_id: number | null);
    /** Opens a stanalone context (without an account manager)
     * automatically starts the event handler */
    static open(cwd: string): Context;
    get dcn_context(): NativeContext;
    get is_open(): boolean;
    open(passphrase?: string): boolean;
    unref(): void;
    acceptChat(chatId: number): void;
    blockChat(chatId: number): void;
    addAddressBook(addressBook: string): any;
    addContactToChat(chatId: number, contactId: number): boolean;
    addDeviceMessage(label: string, msg: Message | string): any;
    setChatVisibility(chatId: number, visibility: C.DC_CHAT_VISIBILITY_NORMAL | C.DC_CHAT_VISIBILITY_ARCHIVED | C.DC_CHAT_VISIBILITY_PINNED): void;
    blockContact(contactId: number, block: boolean): void;
    checkQrCode(qrCode: string): {
        state: number;
        text1: string;
        text1Meaning: string;
        text2: string;
        timestamp: number;
        id: number;
    } | null;
    configure(opts: any): Promise<void>;
    continueKeyTransfer(messageId: number, setupCode: string): Promise<unknown>;
    /** @returns chatId */
    createBroadcastList(): number;
    /** @returns chatId */
    createChatByContactId(contactId: number): number;
    /** @returns contactId */
    createContact(name: string, addr: string): number;
    /**
     *
     * @param chatName The name of the chat that should be created
     * @param is_protected Whether the chat should be protected at creation time
     * @returns chatId
     */
    createGroupChat(chatName: string, is_protected?: boolean): number;
    deleteChat(chatId: number): void;
    deleteContact(contactId: number): boolean;
    deleteMessages(messageIds: number[]): void;
    forwardMessages(messageIds: number[], chatId: number): void;
    getBlobdir(): string;
    getBlockedCount(): number;
    getBlockedContacts(): number[];
    getChat(chatId: number): Chat | null;
    getChatContacts(chatId: number): number[];
    getChatIdByContactId(contactId: number): number;
    getChatMedia(chatId: number, msgType1: number, msgType2: number, msgType3: number): number[];
    getMimeHeaders(messageId: number): string;
    getChatlistItemSummary(chatId: number, messageId: number): Lot;
    getChatMessages(chatId: number, flags: number, marker1before: number): any;
    /**
     * Get encryption info for a chat.
     * Get a multi-line encryption info, containing encryption preferences of all members.
     * Can be used to find out why messages sent to group are not encrypted.
     *
     * @param chatId ID of the chat to get the encryption info for.
     * @return Multi-line text, must be released using dc_str_unref() after usage.
     */
    getChatEncrytionInfo(chatId: number): string;
    getChats(listFlags: number, queryStr: string, queryContactId: number): number[];
    getChatList(listFlags: number, queryStr: string, queryContactId: number): ChatList;
    getConfig(key: string): string;
    getContact(contactId: number): Contact | null;
    getContactEncryptionInfo(contactId: number): any;
    getContacts(listFlags: number, query: string): any;
    wasDeviceMessageEverAdded(label: string): boolean;
    getDraft(chatId: number): Message | null;
    getFreshMessageCount(chatId: number): number;
    getFreshMessages(): any;
    getInfo(): {
        [key: string]: string;
    };
    getMessage(messageId: number): Message | null;
    getMessageCount(chatId: number): number;
    getMessageInfo(messageId: number): string;
    getMessageHTML(messageId: number): string;
    getNextMediaMessage(messageId: number, msgType1: number, msgType2: number, msgType3: number): number;
    getPreviousMediaMessage(messageId: number, msgType1: number, msgType2: number, msgType3: number): number;
    _getNextMedia(messageId: number, dir: number, msgType1: number, msgType2: number, msgType3: number): number;
    getSecurejoinQrCode(chatId: number): string;
    getSecurejoinQrCodeSVG(chatId: number): string;
    startIO(): void;
    stopIO(): void;
    stopOngoingProcess(): void;
    /**
     *
     * @deprecated please use `AccountManager.getSystemInfo()` instead
     */
    static getSystemInfo(): {
        deltachat_core_version: string;
        sqlite_version: string;
        sqlite_thread_safe: string;
        libetpan_version: string;
        openssl_version: string;
        compile_date: string;
        arch: string;
    };
    getConnectivity(): number;
    getConnectivityHTML(): String;
    importExport(what: number, param1: string, param2?: string): void;
    importExportHasBackup(dir: string): any;
    initiateKeyTransfer(): Promise<string>;
    isConfigured(): boolean;
    isContactInChat(chatId: number, contactId: number): boolean;
    /**
     *
     * @returns resulting chat id or 0 on error
     */
    joinSecurejoin(qrCode: string): number;
    lookupContactIdByAddr(addr: string): number;
    markNoticedChat(chatId: number): void;
    markSeenMessages(messageIds: number[]): void;
    maybeNetwork(): void;
    messageNew(viewType?: C): Message;
    removeContactFromChat(chatId: number, contactId: number): boolean;
    /**
     *
     * @param chatId 	ID of the chat to search messages in. Set this to 0 for a global search.
     * @param query The query to search for.
     */
    searchMessages(chatId: number, query: string): number[];
    sendMessage(chatId: number, msg: string | Message): any;
    downloadFullMessage(messageId: number): void;
    /**
     *
     * @returns {Promise<number>} Promise that resolves into the resulting message id
     */
    sendVideochatInvitation(chatId: number): Promise<number>;
    setChatName(chatId: number, name: string): boolean;
    /**
     *
     * @param chatId
     * @param protect
     * @returns success boolean
     */
    setChatProtection(chatId: number, protect: boolean): boolean;
    getChatEphemeralTimer(chatId: number): number;
    setChatEphemeralTimer(chatId: number, timer: number): boolean;
    setChatProfileImage(chatId: number, image: string): boolean;
    setConfig(key: string, value: string | boolean | number): number;
    setConfigFromQr(qrcodeContent: string): boolean;
    estimateDeletionCount(fromServer: boolean, seconds: number): number;
    setStockTranslation(stockId: number, stockMsg: string): boolean;
    setDraft(chatId: number, msg: Message | null): void;
    setLocation(latitude: number, longitude: number, accuracy: number): void;
    getLocations(chatId: number, contactId: number, timestampFrom?: number, timestampTo?: number): {
        accuracy: number;
        latitude: number; /**
         * Wrapper around dcn_context_t*
         *
         * only acts as event emitter when created in standalone mode (without account manager)
         * with `Context.open`
         */
        longitude: number;
        timestamp: number;
        contactId: number;
        msgId: number;
        chatId: number;
        isIndependent: boolean;
        marker: string;
    }[];
    /**
     *
     * @param duration The duration (0 for no mute, -1 for forever mute, everything else is is the relative mute duration from now in seconds)
     */
    setChatMuteDuration(chatId: number, duration: number): boolean;
    /** get information about the provider */
    getProviderFromEmail(email: string): {
        before_login_hint: any;
        overview_page: any;
        status: any;
    } | undefined;
    sendWebxdcStatusUpdate<T>(msgId: number, json: WebxdcSendingStatusUpdate<T>, descr: string): boolean;
    getWebxdcStatusUpdates<T>(msgId: number, serial?: number): WebxdcReceivedStatusUpdate<T>[];
    /** the string contains the binary data, it is an "u8 string", maybe we will use a more efficient type in the future. */
    getWebxdcBlob(message: Message, filename: string): Buffer | null;
}
export declare type WebxdcInfo = {
    name: string;
    icon: string;
    summary: string;
    /**
     * if set by the webxdc, name of the document in edit
     */
    document?: string;
};
declare type WebxdcSendingStatusUpdate<T> = {
    /** the payload, deserialized json:
     * any javascript primitive, array or object. */
    payload: T;
    /** optional, short, informational message that will be added to the chat,
     * eg. "Alice voted" or "Bob scored 123 in MyGame";
     * usually only one line of text is shown,
     * use this option sparingly to not spam the chat. */
    info?: string;
    /** optional, short text, shown beside app icon;
     * it is recommended to use some aggregated value,
     * eg. "8 votes", "Highscore: 123" */
    summary?: string;
    /**
     * optional, name of the document in edit,
     * must not be used eg. in games where the Webxdc does not create documents
     */
    document?: string;
};
declare type WebxdcReceivedStatusUpdate<T> = {
    /** the payload, deserialized json */
    payload: T;
    /** the serial number of this update. Serials are larger `0` and newer serials have higher numbers. */
    serial: number;
    /** the maximum serial currently known.
     *  If `max_serial` equals `serial` this update is the last update (until new network messages arrive). */
    max_serial: number;
    /** optional, short, informational message. */
    info?: string;
    /** optional, short text, shown beside app icon. If there are no updates, an empty JSON-array is returned. */
    summary?: string;
};
export {};
//# sourceMappingURL=context.d.ts.map