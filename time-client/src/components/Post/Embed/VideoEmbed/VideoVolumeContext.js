import { jsx as _jsx } from "react/jsx-runtime";
import React from 'react';
const Context = React.createContext(null);
Context.displayName = 'VideoVolumeContext';
export function Provider({ children }) {
    const [muted, setMuted] = React.useState(true);
    const [volume, setVolume] = React.useState(1);
    const value = React.useMemo(() => ({
        muted,
        setMuted,
        volume,
        setVolume,
    }), [muted, setMuted, volume, setVolume]);
    return _jsx(Context.Provider, { value: value, children: children });
}
export function useVideoVolumeState() {
    const context = React.useContext(Context);
    if (!context) {
        throw new Error('useVideoVolumeState must be used within a VideoVolumeProvider');
    }
    return [context.volume, context.setVolume];
}
export function useVideoMuteState() {
    const context = React.useContext(Context);
    if (!context) {
        throw new Error('useVideoMuteState must be used within a VideoVolumeProvider');
    }
    return [context.muted, context.setMuted];
}
//# sourceMappingURL=VideoVolumeContext.js.map