import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import React from 'react';
import { View } from 'react-native';
import { ScrollProvider } from '#/lib/ScrollContext';
import { List } from '#/view/com/util/List';
import { Button, ButtonText } from '#/components/Button';
import * as Toggle from '#/components/forms/Toggle';
import { Text } from '#/components/Typography';
export function ListContained() {
    const [animated, setAnimated] = React.useState(false);
    const ref = React.useRef(null);
    const data = React.useMemo(() => {
        return Array.from({ length: 100 }, (_, i) => ({
            id: i,
            text: `Message ${i}`,
        }));
    }, []);
    return (_jsxs(_Fragment, { children: [_jsx(View, { style: { width: '100%', height: 300 }, children: _jsx(ScrollProvider, { onScroll: e => {
                        'worklet';
                        console.log(JSON.stringify({
                            contentOffset: e.contentOffset,
                            layoutMeasurement: e.layoutMeasurement,
                            contentSize: e.contentSize,
                        }));
                    }, children: _jsx(List, { data: data, renderItem: item => {
                            return (_jsx(View, { style: {
                                    padding: 10,
                                    borderBottomWidth: 1,
                                    borderBottomColor: 'rgba(0,0,0,0.1)',
                                }, children: _jsx(Text, { children: item.item.text }) }));
                        }, keyExtractor: item => item.id.toString(), disableFullWindowScroll: true, style: { flex: 1 }, onStartReached: () => {
                            console.log('Start Reached');
                        }, onEndReached: () => {
                            console.log('End Reached (threshold of 2)');
                        }, onEndReachedThreshold: 2, ref: ref, disableVirtualization: true }) }) }), _jsx(View, { style: { flexDirection: 'row', gap: 10, alignItems: 'center' }, children: _jsxs(Toggle.Item, { name: "a", label: "Click me", value: animated, onChange: () => setAnimated(prev => !prev), children: [_jsx(Toggle.Checkbox, {}), _jsx(Toggle.LabelText, { children: "Animated Scrolling" })] }) }), _jsx(Button, { variant: "solid", color: "primary", size: "large", label: "Scroll to End", onPress: () => ref.current?.scrollToOffset({ animated, offset: 0 }), children: _jsx(ButtonText, { children: "Scroll to Top" }) }), _jsx(Button, { variant: "solid", color: "primary", size: "large", label: "Scroll to End", onPress: () => ref.current?.scrollToEnd({ animated }), children: _jsx(ButtonText, { children: "Scroll to End" }) }), _jsx(Button, { variant: "solid", color: "primary", size: "large", label: "Scroll to Offset 100", onPress: () => ref.current?.scrollToOffset({ animated, offset: 500 }), children: _jsx(ButtonText, { children: "Scroll to Offset 500" }) })] }));
}
//# sourceMappingURL=ListContained.js.map