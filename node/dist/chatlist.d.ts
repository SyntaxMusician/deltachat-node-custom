import { Lot } from './lot';
import { Chat } from './chat';
interface NativeChatList {
}
/**
 * Wrapper around dc_chatlist_t*
 */
export declare class ChatList {
    private dc_chatlist;
    constructor(dc_chatlist: NativeChatList);
    getChatId(index: number): number;
    getCount(): number;
    getMessageId(index: number): number;
    getSummary(index: number, chat?: Chat): Lot;
}
export {};
//# sourceMappingURL=chatlist.d.ts.map