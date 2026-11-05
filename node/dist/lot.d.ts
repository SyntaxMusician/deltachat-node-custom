interface NativeLot {
}
/**
 * Wrapper around dc_lot_t*
 */
export declare class Lot {
    dc_lot: NativeLot;
    constructor(dc_lot: NativeLot);
    toJson(): {
        state: number;
        text1: string;
        text1Meaning: string;
        text2: string;
        timestamp: number;
    };
    getId(): number;
    getState(): number;
    getText1(): string;
    getText1Meaning(): string;
    getText2(): string;
    getTimestamp(): number;
}
export {};
//# sourceMappingURL=lot.d.ts.map