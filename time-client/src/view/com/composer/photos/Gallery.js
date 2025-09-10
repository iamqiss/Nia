import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { Keyboard, StyleSheet, TouchableOpacity, View, } from 'react-native';
import { Image } from 'expo-image';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { msg, Trans } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { useWebMediaQueries } from '#/lib/hooks/useWebMediaQueries';
import {} from '#/lib/media/types';
import { colors, s } from '#/lib/styles';
import { isNative } from '#/platform/detection';
import { cropImage } from '#/state/gallery';
import { Text } from '#/view/com/util/text/Text';
import { useTheme } from '#/alf';
import * as Dialog from '#/components/Dialog';
import { MediaInsetBorder } from '#/components/MediaInsetBorder';
import {} from '../state/composer';
import { EditImageDialog } from './EditImageDialog';
import { ImageAltTextDialog } from './ImageAltTextDialog';
const IMAGE_GAP = 8;
export let Gallery = (props) => {
    const [containerInfo, setContainerInfo] = React.useState();
    const onLayout = (evt) => {
        const { width, height } = evt.nativeEvent.layout;
        setContainerInfo({
            width,
            height,
        });
    };
    return (_jsx(View, { onLayout: onLayout, children: containerInfo ? (_jsx(GalleryInner, { ...props, containerInfo: containerInfo })) : undefined }));
};
Gallery = React.memo(Gallery);
const GalleryInner = ({ images, containerInfo, dispatch }) => {
    const { isMobile } = useWebMediaQueries();
    const { altTextControlStyle, imageControlsStyle, imageStyle } = React.useMemo(() => {
        const side = images.length === 1
            ? 250
            : (containerInfo.width - IMAGE_GAP * (images.length - 1)) /
                images.length;
        const isOverflow = isMobile && images.length > 2;
        return {
            altTextControlStyle: isOverflow
                ? { left: 4, bottom: 4 }
                : !isMobile && images.length < 3
                    ? { left: 8, top: 8 }
                    : { left: 4, top: 4 },
            imageControlsStyle: {
                display: 'flex',
                flexDirection: 'row',
                position: 'absolute',
                ...(isOverflow
                    ? { top: 4, right: 4, gap: 4 }
                    : !isMobile && images.length < 3
                        ? { top: 8, right: 8, gap: 8 }
                        : { top: 4, right: 4, gap: 4 }),
                zIndex: 1,
            },
            imageStyle: {
                height: side,
                width: side,
            },
        };
    }, [images.length, containerInfo, isMobile]);
    return images.length !== 0 ? (_jsxs(_Fragment, { children: [_jsx(View, { testID: "selectedPhotosView", style: styles.gallery, children: images.map(image => {
                    return (_jsx(GalleryItem, { image: image, altTextControlStyle: altTextControlStyle, imageControlsStyle: imageControlsStyle, imageStyle: imageStyle, onChange: next => {
                            dispatch({ type: 'embed_update_image', image: next });
                        }, onRemove: () => {
                            dispatch({ type: 'embed_remove_image', image });
                        } }, image.source.id));
                }) }), _jsx(AltTextReminder, {})] })) : null;
};
const GalleryItem = ({ image, altTextControlStyle, imageControlsStyle, imageStyle, onChange, onRemove, }) => {
    const { _ } = useLingui();
    const t = useTheme();
    const altTextControl = Dialog.useDialogControl();
    const editControl = Dialog.useDialogControl();
    const onImageEdit = () => {
        if (isNative) {
            cropImage(image).then(next => {
                onChange(next);
            });
        }
        else {
            editControl.open();
        }
    };
    const onAltTextEdit = () => {
        Keyboard.dismiss();
        altTextControl.open();
    };
    return (_jsxs(View, { style: imageStyle, 
        // Fixes ALT and icons appearing with half opacity when the post is inactive
        renderToHardwareTextureAndroid: true, children: [_jsxs(TouchableOpacity, { testID: "altTextButton", accessibilityRole: "button", accessibilityLabel: _(msg `Add alt text`), accessibilityHint: "", onPress: onAltTextEdit, style: [styles.altTextControl, altTextControlStyle], children: [image.alt.length !== 0 ? (_jsx(FontAwesomeIcon, { icon: "check", size: 10, style: { color: t.palette.white } })) : (_jsx(FontAwesomeIcon, { icon: "plus", size: 10, style: { color: t.palette.white } })), _jsx(Text, { style: styles.altTextControlLabel, accessible: false, children: _jsx(Trans, { children: "ALT" }) })] }), _jsxs(View, { style: imageControlsStyle, children: [_jsx(TouchableOpacity, { testID: "editPhotoButton", accessibilityRole: "button", accessibilityLabel: _(msg `Edit image`), accessibilityHint: "", onPress: onImageEdit, style: styles.imageControl, children: _jsx(FontAwesomeIcon, { icon: "pen", size: 12, style: { color: colors.white } }) }), _jsx(TouchableOpacity, { testID: "removePhotoButton", accessibilityRole: "button", accessibilityLabel: _(msg `Remove image`), accessibilityHint: "", onPress: onRemove, style: styles.imageControl, children: _jsx(FontAwesomeIcon, { icon: "xmark", size: 16, style: { color: colors.white } }) })] }), _jsx(TouchableOpacity, { accessibilityRole: "button", accessibilityLabel: _(msg `Add alt text`), accessibilityHint: "", onPress: onAltTextEdit, style: styles.altTextHiddenRegion }), _jsx(Image, { testID: "selectedPhotoImage", style: [styles.image, imageStyle], source: {
                    uri: (image.transformed ?? image.source).path,
                }, accessible: true, accessibilityIgnoresInvertColors: true, cachePolicy: "none", autoplay: false }), _jsx(MediaInsetBorder, {}), _jsx(ImageAltTextDialog, { control: altTextControl, image: image, onChange: onChange }), _jsx(EditImageDialog, { control: editControl, image: image, onChange: onChange })] }));
};
export function AltTextReminder() {
    const t = useTheme();
    return (_jsxs(View, { style: [styles.reminder], children: [_jsx(View, { style: [styles.infoIcon, t.atoms.bg_contrast_25], children: _jsx(FontAwesomeIcon, { icon: "info", size: 12, color: t.atoms.text.color }) }), _jsx(Text, { type: "sm", style: [t.atoms.text_contrast_medium, s.flex1], children: _jsx(Trans, { children: "Alt text describes images for blind and low-vision users, and helps give context to everyone." }) })] }));
}
const styles = StyleSheet.create({
    gallery: {
        flex: 1,
        flexDirection: 'row',
        gap: IMAGE_GAP,
        marginTop: 16,
    },
    image: {
        resizeMode: 'cover',
        borderRadius: 8,
    },
    imageControl: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    altTextControl: {
        position: 'absolute',
        zIndex: 1,
        borderRadius: 6,
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        paddingHorizontal: 8,
        paddingVertical: 3,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    altTextControlLabel: {
        color: 'white',
        fontSize: 12,
        fontWeight: '600',
        letterSpacing: 1,
    },
    altTextHiddenRegion: {
        position: 'absolute',
        left: 4,
        right: 4,
        bottom: 4,
        top: 30,
        zIndex: 1,
    },
    reminder: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        borderRadius: 8,
        paddingVertical: 14,
    },
    infoIcon: {
        width: 22,
        height: 22,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
//# sourceMappingURL=Gallery.js.map