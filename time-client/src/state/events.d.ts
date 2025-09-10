type UnlistenFn = () => void;
export declare function emitSoftReset(): void;
export declare function listenSoftReset(fn: () => void): UnlistenFn;
export declare function emitSessionDropped(): void;
export declare function listenSessionDropped(fn: () => void): UnlistenFn;
export declare function emitNetworkConfirmed(): void;
export declare function listenNetworkConfirmed(fn: () => void): UnlistenFn;
export declare function emitNetworkLost(): void;
export declare function listenNetworkLost(fn: () => void): UnlistenFn;
export declare function emitPostCreated(): void;
export declare function listenPostCreated(fn: () => void): UnlistenFn;
export {};
//# sourceMappingURL=events.d.ts.map