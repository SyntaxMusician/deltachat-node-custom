interface NativeLocations {
}
/**
 * Wrapper around dc_location_t*
 */
export declare class Locations {
    dc_locations: NativeLocations;
    constructor(dc_locations: NativeLocations);
    locationToJson(index: number): {
        accuracy: number;
        latitude: number;
        longitude: number;
        timestamp: number;
        contactId: number;
        msgId: number;
        chatId: number;
        isIndependent: boolean;
        marker: string;
    };
    toJson(): ReturnType<Locations['locationToJson']>[];
    getCount(): number;
    getAccuracy(index: number): number;
    getLatitude(index: number): number;
    getLongitude(index: number): number;
    getTimestamp(index: number): number;
    getMsgId(index: number): number;
    getContactId(index: number): number;
    getChatId(index: number): number;
    isIndependent(index: number): boolean;
    getMarker(index: number): string;
}
export {};
//# sourceMappingURL=locations.d.ts.map