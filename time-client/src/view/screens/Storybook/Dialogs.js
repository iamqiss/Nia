import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { View } from 'react-native';
import { useDialogStateControlContext } from '#/state/dialogs';
import { atoms as a } from '#/alf';
import { Button, ButtonText } from '#/components/Button';
import * as Dialog from '#/components/Dialog';
import * as Menu from '#/components/Menu';
import * as Prompt from '#/components/Prompt';
import { H3, P, Text } from '#/components/Typography';
import { PlatformInfo } from '../../../../modules/expo-bluesky-swiss-army';
export function Dialogs() {
    const scrollable = Dialog.useDialogControl();
    const basic = Dialog.useDialogControl();
    const prompt = Prompt.usePromptControl();
    const withMenu = Dialog.useDialogControl();
    const testDialog = Dialog.useDialogControl();
    const { closeAllDialogs } = useDialogStateControlContext();
    const unmountTestDialog = Dialog.useDialogControl();
    const [reducedMotionEnabled, setReducedMotionEnabled] = React.useState();
    const [shouldRenderUnmountTest, setShouldRenderUnmountTest] = React.useState(false);
    const unmountTestInterval = React.useRef(undefined);
    const onUnmountTestStartPressWithClose = () => {
        setShouldRenderUnmountTest(true);
        setTimeout(() => {
            unmountTestDialog.open();
        }, 1000);
        setTimeout(() => {
            unmountTestDialog.close();
        }, 4950);
        setInterval(() => {
            setShouldRenderUnmountTest(prev => !prev);
        }, 5000);
    };
    const onUnmountTestStartPressWithoutClose = () => {
        setShouldRenderUnmountTest(true);
        setTimeout(() => {
            unmountTestDialog.open();
        }, 1000);
        setInterval(() => {
            setShouldRenderUnmountTest(prev => !prev);
        }, 5000);
    };
    const onUnmountTestEndPress = () => {
        setShouldRenderUnmountTest(false);
        clearInterval(unmountTestInterval.current);
    };
    return (_jsxs(View, { style: [a.gap_md], children: [_jsx(Button, { variant: "outline", color: "secondary", size: "small", onPress: () => {
                    scrollable.open();
                    prompt.open();
                    basic.open();
                    withMenu.open();
                }, label: "Open basic dialog", children: _jsx(ButtonText, { children: "Open all dialogs" }) }), _jsx(Button, { variant: "outline", color: "secondary", size: "small", onPress: () => {
                    scrollable.open();
                }, label: "Open basic dialog", children: _jsx(ButtonText, { children: "Open scrollable dialog" }) }), _jsx(Button, { variant: "outline", color: "secondary", size: "small", onPress: () => {
                    basic.open();
                }, label: "Open basic dialog", children: _jsx(ButtonText, { children: "Open basic dialog" }) }), _jsx(Button, { variant: "outline", color: "primary", size: "small", onPress: () => withMenu.open(), label: "Open dialog with menu in it", children: _jsx(ButtonText, { children: "Open dialog with menu in it" }) }), _jsx(Button, { variant: "solid", color: "primary", size: "small", onPress: () => prompt.open(), label: "Open prompt", children: _jsx(ButtonText, { children: "Open prompt" }) }), _jsx(Button, { variant: "solid", color: "primary", size: "small", onPress: testDialog.open, label: "one", children: _jsx(ButtonText, { children: "Open Tester" }) }), _jsx(Button, { variant: "solid", color: "primary", size: "small", onPress: onUnmountTestStartPressWithClose, label: "two", children: _jsx(ButtonText, { children: "Start Unmount Test With `.close()` call" }) }), _jsx(Button, { variant: "solid", color: "primary", size: "small", onPress: onUnmountTestStartPressWithoutClose, label: "two", children: _jsx(ButtonText, { children: "Start Unmount Test Without `.close()` call" }) }), _jsx(Button, { variant: "solid", color: "primary", size: "small", onPress: onUnmountTestEndPress, label: "two", children: _jsx(ButtonText, { children: "End Unmount Test" }) }), _jsx(Button, { variant: "solid", color: "primary", size: "small", onPress: () => {
                    const isReducedMotionEnabled = PlatformInfo.getIsReducedMotionEnabled();
                    setReducedMotionEnabled(isReducedMotionEnabled);
                }, label: "two", children: _jsxs(ButtonText, { children: ["Is reduced motion enabled?: (", reducedMotionEnabled?.toString() || 'undefined', ")"] }) }), _jsxs(Prompt.Outer, { control: prompt, children: [_jsx(Prompt.TitleText, { children: "This is a prompt" }), _jsx(Prompt.DescriptionText, { children: "This is a generic prompt component. It accepts a title and a description, as well as two actions." }), _jsxs(Prompt.Actions, { children: [_jsx(Prompt.Cancel, {}), _jsx(Prompt.Action, { cta: "Confirm", onPress: () => { } })] })] }), _jsx(Dialog.Outer, { control: basic, children: _jsxs(Dialog.Inner, { label: "test", children: [_jsx(H3, { nativeID: "dialog-title", children: "Dialog" }), _jsx(P, { nativeID: "dialog-description", children: "A basic dialog" })] }) }), _jsx(Dialog.Outer, { control: withMenu, children: _jsxs(Dialog.Inner, { label: "test", children: [_jsx(H3, { nativeID: "dialog-title", children: "Dialog with Menu" }), _jsxs(Menu.Root, { children: [_jsx(Menu.Trigger, { label: "Open menu", children: ({ props }) => (_jsx(Button, { style: a.mt_2xl, label: "Open menu", color: "primary", variant: "solid", size: "large", ...props, children: _jsx(ButtonText, { children: "Open Menu" }) })) }), _jsx(Menu.Outer, { children: _jsxs(Menu.Group, { children: [_jsx(Menu.Item, { label: "Item 1", onPress: () => console.log('item 1'), children: _jsx(Menu.ItemText, { children: "Item 1" }) }), _jsx(Menu.Item, { label: "Item 2", onPress: () => console.log('item 2'), children: _jsx(Menu.ItemText, { children: "Item 2" }) })] }) })] })] }) }), _jsx(Dialog.Outer, { control: scrollable, children: _jsx(Dialog.ScrollableInner, { accessibilityDescribedBy: "dialog-description", accessibilityLabelledBy: "dialog-title", children: _jsxs(View, { style: [a.relative, a.gap_md, a.w_full], children: [_jsx(H3, { nativeID: "dialog-title", children: "Dialog" }), _jsx(P, { nativeID: "dialog-description", children: "A scrollable dialog with an input within it." }), _jsx(Dialog.Input, { value: "", onChangeText: () => { }, label: "Type here" }), _jsx(Button, { variant: "outline", color: "secondary", size: "small", onPress: closeAllDialogs, label: "Close all dialogs", children: _jsx(ButtonText, { children: "Close all dialogs" }) }), _jsx(View, { style: { height: 1000 } }), _jsx(View, { style: [a.flex_row, a.justify_end], children: _jsx(Button, { variant: "outline", color: "primary", size: "small", onPress: () => scrollable.close(() => {
                                        console.log('CLOSED');
                                    }), label: "Open basic dialog", children: _jsx(ButtonText, { children: "Close dialog" }) }) })] }) }) }), _jsx(Dialog.Outer, { control: testDialog, children: _jsx(Dialog.ScrollableInner, { accessibilityDescribedBy: "dialog-description", accessibilityLabelledBy: "dialog-title", children: _jsxs(View, { style: [a.relative, a.gap_md, a.w_full], children: [_jsx(Text, { children: "Watch the console logs to test each of these dialog edge cases. Functionality should be consistent across both native and web. If not then *sad face* something is wrong." }), _jsx(Button, { variant: "outline", color: "primary", size: "small", onPress: () => {
                                    testDialog.close(() => {
                                        console.log('close callback');
                                    });
                                }, label: "Close It", children: _jsx(ButtonText, { children: "Normal Use (Should just log)" }) }), _jsx(Button, { variant: "outline", color: "primary", size: "small", onPress: () => {
                                    testDialog.close(() => {
                                        console.log('close callback');
                                    });
                                    setTimeout(() => {
                                        testDialog.open();
                                    }, 100);
                                }, label: "Close It", children: _jsx(ButtonText, { children: "Calls `.open()` in 100ms (Should log when the animation switches to open)" }) }), _jsx(Button, { variant: "outline", color: "primary", size: "small", onPress: () => {
                                    setTimeout(() => {
                                        testDialog.open();
                                    }, 2e3);
                                    testDialog.close(() => {
                                        console.log('close callback');
                                    });
                                }, label: "Close It", children: _jsx(ButtonText, { children: "Calls `.open()` in 2000ms (Should log after close animation and not log on open)" }) }), _jsx(Button, { variant: "outline", color: "primary", size: "small", onPress: () => {
                                    testDialog.close(() => {
                                        console.log('close callback');
                                    });
                                    setTimeout(() => {
                                        testDialog.close(() => {
                                            console.log('close callback after 100ms');
                                        });
                                    }, 100);
                                }, label: "Close It", children: _jsx(ButtonText, { children: "Calls `.close()` then again in 100ms (should log twice)" }) }), _jsx(Button, { variant: "outline", color: "primary", size: "small", onPress: () => {
                                    testDialog.close(() => {
                                        console.log('close callback');
                                    });
                                    testDialog.close(() => {
                                        console.log('close callback 2');
                                    });
                                }, label: "Close It", children: _jsx(ButtonText, { children: "Call `close()` twice immediately (should just log twice)" }) }), _jsx(Button, { variant: "outline", color: "primary", size: "small", onPress: () => {
                                    console.log('Step 1');
                                    testDialog.close(() => {
                                        console.log('Step 3');
                                    });
                                    console.log('Step 2');
                                }, label: "Close It", children: _jsx(ButtonText, { children: "Log before `close()`, after `close()` and in the `close()` callback. Should be an order of 1 2 3" }) })] }) }) }), shouldRenderUnmountTest && (_jsx(Dialog.Outer, { control: unmountTestDialog, children: _jsxs(Dialog.Inner, { label: "test", children: [_jsx(H3, { nativeID: "dialog-title", children: "Unmount Test Dialog" }), _jsx(P, { nativeID: "dialog-description", children: "Will unmount in about 5 seconds" })] }) }))] }));
}
//# sourceMappingURL=Dialogs.js.map