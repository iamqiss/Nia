import { jsx as _jsx } from "react/jsx-runtime";
import React from 'react';
import { requireNativeModule } from 'expo';
import { requireNativeViewManager } from 'expo-modules-core';
import { GifViewProps } from './GifView.types';
const NativeModule = requireNativeModule('ExpoBlueskyGifView');
const NativeView = requireNativeViewManager('ExpoBlueskyGifView');
export class GifView extends React.PureComponent {
    // TODO native types, should all be the same as those in this class
    nativeRef = React.createRef();
    constructor(props) {
        super(props);
    }
    static async prefetchAsync(sources) {
        return await NativeModule.prefetchAsync(sources);
    }
    async playAsync() {
        await this.nativeRef.current.playAsync();
    }
    async pauseAsync() {
        await this.nativeRef.current.pauseAsync();
    }
    async toggleAsync() {
        await this.nativeRef.current.toggleAsync();
    }
    render() {
        return _jsx(NativeView, { ...this.props, ref: this.nativeRef });
    }
}
//# sourceMappingURL=GifView.js.map