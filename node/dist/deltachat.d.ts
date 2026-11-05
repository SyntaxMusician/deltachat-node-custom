/// <reference types="node" />
import { EventEmitter } from 'events';
import { Context } from './context';
interface NativeAccount {
}
/**
 * Wrapper around dcn_account_t*
 */
export declare class AccountManager extends EventEmitter {
    dcn_accounts: NativeAccount;
    accountDir: string;
    jsonRpcStarted: boolean;
    constructor(cwd: string, os?: string);
    getAllAccountIds(): any;
    selectAccount(account_id: number): any;
    selectedAccount(): number;
    addAccount(): number;
    addClosedAccount(): number;
    removeAccount(account_id: number): any;
    accountContext(account_id: number): Context;
    migrateAccount(dbfile: string): number;
    close(): void;
    emit(event: string | symbol, account_id: number, data1: any, data2: any): boolean;
    handleCoreEvent(eventId: number, accountId: number, data1: number, data2: number | string): void;
    startEvents(): void;
    startJsonRpcHandler(callback: ((response: string) => void) | null): void;
    jsonRpcRequest(message: string): void;
    startIO(): void;
    stopIO(): void;
    static maybeValidAddr(addr: string): boolean;
    static parseGetInfo(info: string): {
        [key: string]: string;
    };
    static newTemporary(): {
        dc: AccountManager;
        context: Context;
        accountId: number;
        directory: string;
    };
    static getSystemInfo(): {
        deltachat_core_version: string;
        sqlite_version: string;
        sqlite_thread_safe: string;
        libetpan_version: string;
        openssl_version: string;
        compile_date: string;
        arch: string;
    };
    /** get information about the provider
     *
     * This function creates a temporary context to be standalone,
     * if possible use `Context.getProviderFromEmail` instead. (otherwise potential proxy settings are not used)
     * @deprecated
     */
    static getProviderFromEmail(email: string): {
        before_login_hint: any;
        overview_page: any;
        status: any;
    } | undefined;
}
export {};
//# sourceMappingURL=deltachat.d.ts.map