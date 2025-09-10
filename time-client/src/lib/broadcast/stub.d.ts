export default class BroadcastChannel {
    name: string;
    constructor(name: string);
    postMessage(_data: any): void;
    close(): void;
    onmessage: (event: MessageEvent) => void;
    addEventListener(_type: string, _listener: (event: MessageEvent) => void): void;
    removeEventListener(_type: string, _listener: (event: MessageEvent) => void): void;
}
//# sourceMappingURL=stub.d.ts.map