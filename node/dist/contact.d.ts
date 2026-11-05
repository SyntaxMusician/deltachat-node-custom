interface NativeContact {
}
/**
 * Wrapper around dc_contact_t*
 */
export declare class Contact {
    dc_contact: NativeContact;
    constructor(dc_contact: NativeContact);
    toJson(): {
        address: string;
        color: string;
        authName: string;
        status: string;
        displayName: string;
        id: number;
        lastSeen: number;
        name: string;
        profileImage: string;
        nameAndAddr: string;
        isBlocked: boolean;
        isVerified: boolean;
    };
    getAddress(): string;
    /** Get original contact name.
     * This is the name of the contact as defined by the contact themself.
     * If the contact themself does not define such a name,
     * an empty string is returned. */
    get authName(): string;
    get color(): string;
    /**
     * contact's status
     *
     * Status is the last signature received in a message from this contact.
     */
    get status(): string;
    getDisplayName(): string;
    getId(): number;
    get lastSeen(): number;
    wasSeenRecently(): boolean;
    getName(): string;
    getNameAndAddress(): string;
    getProfileImage(): string;
    isBlocked(): boolean;
    isVerified(): boolean;
}
export {};
//# sourceMappingURL=contact.d.ts.map