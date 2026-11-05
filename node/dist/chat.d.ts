import { C } from './constants';
import { ChatJSON } from './types';
interface NativeChat {
}
/**
 * Wrapper around dc_chat_t*
 */
export declare class Chat {
    dc_chat: NativeChat;
    constructor(dc_chat: NativeChat);
    getVisibility(): C.DC_CHAT_VISIBILITY_NORMAL | C.DC_CHAT_VISIBILITY_ARCHIVED | C.DC_CHAT_VISIBILITY_PINNED;
    get color(): string;
    getId(): number;
    getName(): string;
    getMailinglistAddr(): string;
    getProfileImage(): string;
    getType(): number;
    isSelfTalk(): boolean;
    isContactRequest(): boolean;
    isUnpromoted(): boolean;
    isProtected(): boolean;
    get canSend(): boolean;
    isDeviceTalk(): boolean;
    isSingle(): boolean;
    isGroup(): boolean;
    isMuted(): boolean;
    toJson(): ChatJSON;
}
export {};
//# sourceMappingURL=chat.d.ts.map