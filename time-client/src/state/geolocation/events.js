import EventEmitter from 'eventemitter3';
import {} from '#/storage';
const events = new EventEmitter();
const EVENT = 'geolocation-config-updated';
export const emitGeolocationConfigUpdate = (config) => {
    events.emit(EVENT, config);
};
export const onGeolocationConfigUpdate = (listener) => {
    events.on(EVENT, listener);
    return () => {
        events.off(EVENT, listener);
    };
};
//# sourceMappingURL=events.js.map