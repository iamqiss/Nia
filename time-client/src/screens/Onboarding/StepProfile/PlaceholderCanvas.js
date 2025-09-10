import { jsx as _jsx } from "react/jsx-runtime";
import React from 'react';
import { View } from 'react-native';
import { useAvatar } from '#/screens/Onboarding/StepProfile/index';
import { atoms as a } from '#/alf';
const LazyViewShot = React.lazy(
// @ts-expect-error dynamic import
() => import('react-native-view-shot/src/index'));
const SIZE_MULTIPLIER = 5;
// This component is supposed to be invisible to the user. We only need this for ViewShot to have something to
// "screenshot".
export const PlaceholderCanvas = React.forwardRef(function PlaceholderCanvas({}, ref) {
    const { avatar } = useAvatar();
    const viewshotRef = React.useRef(null);
    const Icon = avatar.placeholder.component;
    const styles = React.useMemo(() => ({
        container: [a.absolute, { top: -2000 }],
        imageContainer: [
            a.align_center,
            a.justify_center,
            { height: 150 * SIZE_MULTIPLIER, width: 150 * SIZE_MULTIPLIER },
        ],
    }), []);
    React.useImperativeHandle(ref, () => ({
        capture: async () => {
            if (viewshotRef.current?.capture) {
                return await viewshotRef.current.capture();
            }
        },
    }));
    return (_jsx(View, { style: styles.container, children: _jsx(React.Suspense, { fallback: null, children: _jsx(LazyViewShot
            // @ts-ignore this library doesn't have types
            , { 
                // @ts-ignore this library doesn't have types
                ref: viewshotRef, options: {
                    fileName: 'placeholderAvatar',
                    format: 'jpg',
                    quality: 0.8,
                    height: 150 * SIZE_MULTIPLIER,
                    width: 150 * SIZE_MULTIPLIER,
                }, children: _jsx(View, { style: [
                        styles.imageContainer,
                        { backgroundColor: avatar.backgroundColor },
                    ], collapsable: false, children: _jsx(Icon, { height: 85 * SIZE_MULTIPLIER, width: 85 * SIZE_MULTIPLIER, style: { color: 'white' } }) }) }) }) }));
});
//# sourceMappingURL=PlaceholderCanvas.js.map