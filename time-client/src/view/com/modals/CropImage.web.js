import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';
import { LinearGradient } from 'expo-linear-gradient';
import { msg, Trans } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import ReactCrop, {} from 'react-image-crop';
import { usePalette } from '#/lib/hooks/usePalette';
import { useWebMediaQueries } from '#/lib/hooks/useWebMediaQueries';
import {} from '#/lib/media/picker.shared';
import { getDataUriSize } from '#/lib/media/util';
import { gradients, s } from '#/lib/styles';
import { useModalControls } from '#/state/modals';
import { Text } from '#/view/com/util/text/Text';
export const snapPoints = ['0%'];
export function Component({ uri, aspect, circular, onSelect, }) {
    const pal = usePalette('default');
    const { _ } = useLingui();
    const { closeModal } = useModalControls();
    const { isMobile } = useWebMediaQueries();
    const imageRef = React.useRef(null);
    const [crop, setCrop] = React.useState();
    const isEmpty = !crop || (crop.width || crop.height) === 0;
    const onPressCancel = () => {
        onSelect(undefined);
        closeModal();
    };
    const onPressDone = async () => {
        const img = imageRef.current;
        const result = await manipulateAsync(uri, isEmpty
            ? []
            : [
                {
                    crop: {
                        originX: (crop.x * img.naturalWidth) / 100,
                        originY: (crop.y * img.naturalHeight) / 100,
                        width: (crop.width * img.naturalWidth) / 100,
                        height: (crop.height * img.naturalHeight) / 100,
                    },
                },
            ], {
            base64: true,
            format: SaveFormat.JPEG,
        });
        onSelect({
            path: result.uri,
            mime: 'image/jpeg',
            size: result.base64 !== undefined ? getDataUriSize(result.base64) : 0,
            width: result.width,
            height: result.height,
        });
        closeModal();
    };
    return (_jsxs(View, { children: [_jsx(View, { style: [styles.cropper, pal.borderDark], children: _jsx(ReactCrop, { aspect: aspect, crop: crop, onChange: (_pixelCrop, percentCrop) => setCrop(percentCrop), circularCrop: circular, children: _jsx("img", { ref: imageRef, src: uri, style: { maxHeight: '75vh' } }) }) }), _jsxs(View, { style: [styles.btns, isMobile && { paddingHorizontal: 16 }], children: [_jsx(TouchableOpacity, { onPress: onPressCancel, accessibilityRole: "button", accessibilityLabel: _(msg `Cancel image crop`), accessibilityHint: _(msg `Exits image cropping process`), children: _jsx(Text, { type: "xl", style: pal.link, children: _jsx(Trans, { children: "Cancel" }) }) }), _jsx(View, { style: s.flex1 }), _jsx(TouchableOpacity, { onPress: onPressDone, accessibilityRole: "button", accessibilityLabel: _(msg `Save image crop`), accessibilityHint: _(msg `Saves image crop settings`), children: _jsx(LinearGradient, { colors: [gradients.blueLight.start, gradients.blueLight.end], start: { x: 0, y: 0 }, end: { x: 1, y: 1 }, style: [styles.btn], children: _jsx(Text, { type: "xl-medium", style: s.white, children: _jsx(Trans, { children: "Done" }) }) }) })] })] }));
}
const styles = StyleSheet.create({
    cropper: {
        marginLeft: 'auto',
        marginRight: 'auto',
        borderWidth: 1,
        borderRadius: 4,
        overflow: 'hidden',
        alignItems: 'center',
    },
    ctrls: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
    },
    btns: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
    },
    btn: {
        borderRadius: 4,
        paddingVertical: 8,
        paddingHorizontal: 24,
    },
});
//# sourceMappingURL=CropImage.web.js.map