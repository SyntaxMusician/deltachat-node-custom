import { Lot } from './lot';
import { Chat } from './chat';
import { WebxdcInfo } from './context';
export declare enum MessageDownloadState {
    Available = 10,
    Done = 0,
    Failure = 20,
    InProgress = 1000
}
/**
 * Helper class for message states so you can do e.g.
 *
 * if (msg.getState().isPending()) { .. }
 *
 */
export declare class MessageState {
    state: number;
    constructor(state: number);
    isUndefined(): boolean;
    isFresh(): boolean;
    isNoticed(): boolean;
    isSeen(): boolean;
    isPending(): boolean;
    isFailed(): boolean;
    isDelivered(): boolean;
    isReceived(): boolean;
}
/**
 * Helper class for message types so you can do e.g.
 *
 * if (msg.getViewType().isVideo()) { .. }
 *
 */
export declare class MessageViewType {
    viewType: number;
    constructor(viewType: number);
    isText(): boolean;
    isImage(): boolean;
    isGif(): boolean;
    isAudio(): boolean;
    isVoice(): boolean;
    isVideo(): boolean;
    isFile(): boolean;
    isVideochatInvitation(): boolean;
}
interface NativeMessage {
}
/**
 * Wrapper around dc_msg_t*
 */
export declare class Message {
    dc_msg: NativeMessage;
    constructor(dc_msg: NativeMessage);
    toJson(): {
        chatId: number;
        webxdcInfo: WebxdcInfo | null;
        downloadState: MessageDownloadState;
        duration: number;
        file: string;
        fromId: number;
        id: number;
        quotedText: string;
        quotedMessageId: number | null;
        receivedTimestamp: number;
        sortTimestamp: number;
        text: string;
        timestamp: number;
        hasLocation: boolean;
        hasHTML: boolean;
        viewType: any;
        state: any;
        hasDeviatingTimestamp: any;
        showPadlock: boolean;
        summary: {
            state: number;
            text1: string;
            text1Meaning: string;
            text2: string;
            timestamp: number;
        };
        subject: string;
        isSetupmessage: boolean;
        isInfo: boolean;
        isForwarded: boolean;
        dimensions: {
            height: number;
            width: number;
        };
        videochatType: number;
        videochatUrl: string;
        overrideSenderName: string;
        parentId: number | undefined;
    };
    getChatId(): number;
    get webxdcInfo(): WebxdcInfo | null;
    get downloadState(): MessageDownloadState;
    get parent(): Message | null;
    getDuration(): number;
    getFile(): string;
    getFilebytes(): number;
    getFilemime(): string;
    getFilename(): string;
    getFromId(): number;
    getHeight(): number;
    getId(): number;
    getQuotedText(): string;
    getQuotedMessage(): Message | null;
    getReceivedTimestamp(): number;
    getSetupcodebegin(): any;
    getShowpadlock(): boolean;
    getSortTimestamp(): number;
    getState(): MessageState;
    getSummary(chat?: Chat): Lot;
    get subject(): string;
    getSummarytext(approxCharacters: number): string;
    getText(): string;
    getTimestamp(): number;
    getViewType(): MessageViewType;
    getVideochatType(): number;
    getVideochatUrl(): string;
    getWidth(): number;
    get overrideSenderName(): string;
    hasDeviatingTimestamp(): any;
    hasLocation(): boolean;
    get hasHTML(): boolean;
    isDeadDrop(): boolean;
    isForwarded(): boolean;
    isIncreation(): boolean;
    isInfo(): boolean;
    isSent(): boolean;
    isSetupmessage(): boolean;
    latefilingMediasize(width: number, height: number, duration: number): void;
    setDimension(width: number, height: number): this;
    setDuration(duration: number): this;
    setFile(file: string, mime?: string): this;
    setLocation(longitude: number, latitude: number): this;
    setQuote(quotedMessage: Message | null): this;
    setText(text: string): this;
    setHTML(html: string): this;
    setOverrideSenderName(senderName: string): this;
    /** Force the message to be sent in plain text.
     *
     * This API is for bots, there is no need to expose it in the UI.
     */
    forcePlaintext(): void;
}
export {};
//# sourceMappingURL=message.d.ts.map