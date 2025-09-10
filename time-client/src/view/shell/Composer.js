import { jsx as _jsx } from "react/jsx-runtime";
import { useEffect } from 'react';
import { Animated, Easing } from 'react-native';
import { useAnimatedValue } from '#/lib/hooks/useAnimatedValue';
import { useComposerState } from '#/state/shell/composer';
import { atoms as a, useTheme } from '#/alf';
import { ComposePost } from '../com/composer/Composer';
export function Composer({ winHeight }) {
    const state = useComposerState();
    const t = useTheme();
    const initInterp = useAnimatedValue(0);
    useEffect(() => {
        if (state) {
            Animated.timing(initInterp, {
                toValue: 1,
                duration: 300,
                easing: Easing.out(Easing.exp),
                useNativeDriver: true,
            }).start();
        }
        else {
            initInterp.setValue(0);
        }
    }, [initInterp, state]);
    const wrapperAnimStyle = {
        transform: [
            {
                translateY: initInterp.interpolate({
                    inputRange: [0, 1],
                    outputRange: [winHeight, 0],
                }),
            },
        ],
    };
    // rendering
    // =
    if (!state) {
        return null;
    }
    return (_jsx(Animated.View, { style: [a.absolute, a.inset_0, t.atoms.bg, wrapperAnimStyle], "aria-modal": true, accessibilityViewIsModal: true, children: _jsx(ComposePost, { replyTo: state.replyTo, onPost: state.onPost, onPostSuccess: state.onPostSuccess, quote: state.quote, mention: state.mention, text: state.text, imageUris: state.imageUris, videoUri: state.videoUri }) }));
}
//# sourceMappingURL=Composer.js.map