export default class BroadcastChannel {
    name;
    constructor(name) {
        this.name = name;
    }
    postMessage(_data) { }
    close() { }
    onmessage = () => { };
    addEventListener(_type, _listener) { }
    removeEventListener(_type, _listener) { }
}
//# sourceMappingURL=stub.js.map