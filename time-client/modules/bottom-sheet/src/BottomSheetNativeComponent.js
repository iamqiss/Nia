import { jsx as _jsx } from "react/jsx-runtime";
import * as React from 'react';
import { Dimensions, Platform, View, } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { requireNativeModule, requireNativeViewManager } from 'expo-modules-core';
import { isIOS } from '#/platform/detection';
import {} from './BottomSheet.types';
import { BottomSheetPortalProvider } from './BottomSheetPortal';
import { Context as PortalContext } from './BottomSheetPortal';
const screenHeight = Dimensions.get('screen').height;
const NativeView = requireNativeViewManager('BottomSheet');
const NativeModule = requireNativeModule('BottomSheet');
const isIOS15 = Platform.OS === 'ios' &&
    // semvar - can be 3 segments, so can't use Number(Platform.Version)
    Number(Platform.Version.split('.').at(0)) < 16;
export class BottomSheetNativeComponent extends React.Component {
    ref = React.createRef();
    static contextType = PortalContext;
    constructor(props) {
        super(props);
        this.state = {
            open: false,
        };
    }
    present() {
        this.setState({ open: true });
    }
    dismiss() {
        this.ref.current?.dismiss();
    }
    onStateChange = (event) => {
        const { state } = event.nativeEvent;
        const isOpen = state !== 'closed';
        this.setState({ open: isOpen });
        this.props.onStateChange?.(event);
    };
    updateLayout = () => {
        this.ref.current?.updateLayout();
    };
    static dismissAll = async () => {
        await NativeModule.dismissAll();
    };
    render() {
        const Portal = this.context;
        if (!Portal) {
            throw new Error('BottomSheet: You need to wrap your component tree with a <BottomSheetPortalProvider> to use the bottom sheet.');
        }
        if (!this.state.open) {
            return null;
        }
        let extraStyles;
        if (isIOS15 && this.state.viewHeight) {
            const { viewHeight } = this.state;
            const cornerRadius = this.props.cornerRadius ?? 0;
            if (viewHeight < screenHeight / 2) {
                extraStyles = {
                    height: viewHeight,
                    marginTop: screenHeight / 2 - viewHeight,
                    borderTopLeftRadius: cornerRadius,
                    borderTopRightRadius: cornerRadius,
                };
            }
        }
        return (_jsx(Portal, { children: _jsx(BottomSheetNativeComponentInner, { ...this.props, nativeViewRef: this.ref, onStateChange: this.onStateChange, extraStyles: extraStyles, onLayout: e => {
                    const { height } = e.nativeEvent.layout;
                    this.setState({ viewHeight: height });
                    this.updateLayout();
                } }) }));
    }
}
function BottomSheetNativeComponentInner({ children, backgroundColor, onLayout, onStateChange, nativeViewRef, extraStyles, ...rest }) {
    const insets = useSafeAreaInsets();
    const cornerRadius = rest.cornerRadius ?? 0;
    const sheetHeight = isIOS ? screenHeight - insets.top : screenHeight;
    return (_jsx(NativeView, { ...rest, onStateChange: onStateChange, ref: nativeViewRef, style: {
            position: 'absolute',
            height: sheetHeight,
            width: '100%',
        }, containerBackgroundColor: backgroundColor, children: _jsx(View, { style: [
                {
                    flex: 1,
                    backgroundColor,
                },
                Platform.OS === 'android' && {
                    borderTopLeftRadius: cornerRadius,
                    borderTopRightRadius: cornerRadius,
                },
                extraStyles,
            ], children: _jsx(View, { onLayout: onLayout, children: _jsx(BottomSheetPortalProvider, { children: children }) }) }) }));
}
//# sourceMappingURL=BottomSheetNativeComponent.js.map