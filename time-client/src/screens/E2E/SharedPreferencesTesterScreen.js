import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { View } from 'react-native';
import { ScrollView } from '#/view/com/util/Views';
import { atoms as a } from '#/alf';
import { Button, ButtonText } from '#/components/Button';
import * as Layout from '#/components/Layout';
import { Text } from '#/components/Typography';
import { SharedPrefs } from '../../../modules/expo-bluesky-swiss-army';
export function SharedPreferencesTesterScreen() {
    const [currentTestOutput, setCurrentTestOutput] = React.useState('');
    return (_jsx(Layout.Screen, { children: _jsx(ScrollView, { contentContainerStyle: { backgroundColor: 'red' }, children: _jsxs(View, { style: [a.flex_1], children: [_jsx(View, { children: _jsx(Text, { testID: "testOutput", children: currentTestOutput }) }), _jsxs(View, { style: [a.flex_wrap], children: [_jsx(Button, { label: "btn", testID: "setStringBtn", style: [a.self_center], variant: "solid", color: "primary", size: "small", onPress: async () => {
                                    SharedPrefs.removeValue('testerString');
                                    SharedPrefs.setValue('testerString', 'Hello');
                                    const str = SharedPrefs.getString('testerString');
                                    console.log(JSON.stringify(str));
                                    setCurrentTestOutput(`${str}`);
                                }, children: _jsx(ButtonText, { children: "Set String" }) }), _jsx(Button, { label: "btn", testID: "removeStringBtn", style: [a.self_center], variant: "solid", color: "primary", size: "small", onPress: async () => {
                                    SharedPrefs.removeValue('testerString');
                                    const str = SharedPrefs.getString('testerString');
                                    setCurrentTestOutput(`${str}`);
                                }, children: _jsx(ButtonText, { children: "Remove String" }) }), _jsx(Button, { label: "btn", testID: "setBoolBtn", style: [a.self_center], variant: "solid", color: "primary", size: "small", onPress: async () => {
                                    SharedPrefs.removeValue('testerBool');
                                    SharedPrefs.setValue('testerBool', true);
                                    const bool = SharedPrefs.getBool('testerBool');
                                    setCurrentTestOutput(`${bool}`);
                                }, children: _jsx(ButtonText, { children: "Set Bool" }) }), _jsx(Button, { label: "btn", testID: "setNumberBtn", style: [a.self_center], variant: "solid", color: "primary", size: "small", onPress: async () => {
                                    SharedPrefs.removeValue('testerNumber');
                                    SharedPrefs.setValue('testerNumber', 123);
                                    const num = SharedPrefs.getNumber('testerNumber');
                                    setCurrentTestOutput(`${num}`);
                                }, children: _jsx(ButtonText, { children: "Set Number" }) }), _jsx(Button, { label: "btn", testID: "addToSetBtn", style: [a.self_center], variant: "solid", color: "primary", size: "small", onPress: async () => {
                                    SharedPrefs.removeFromSet('testerSet', 'Hello!');
                                    SharedPrefs.addToSet('testerSet', 'Hello!');
                                    const contains = SharedPrefs.setContains('testerSet', 'Hello!');
                                    setCurrentTestOutput(`${contains}`);
                                }, children: _jsx(ButtonText, { children: "Add to Set" }) }), _jsx(Button, { label: "btn", testID: "removeFromSetBtn", style: [a.self_center], variant: "solid", color: "primary", size: "small", onPress: async () => {
                                    SharedPrefs.removeFromSet('testerSet', 'Hello!');
                                    const contains = SharedPrefs.setContains('testerSet', 'Hello!');
                                    setCurrentTestOutput(`${contains}`);
                                }, children: _jsx(ButtonText, { children: "Remove from Set" }) })] })] }) }) }));
}
//# sourceMappingURL=SharedPreferencesTesterScreen.js.map