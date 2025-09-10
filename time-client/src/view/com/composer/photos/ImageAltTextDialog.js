import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { useWindowDimensions, View } from 'react-native';
import { Image } from 'expo-image';
import { msg, Plural, Trans } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { MAX_ALT_TEXT } from '#/lib/constants';
import { enforceLen } from '#/lib/strings/helpers';
import { isAndroid, isWeb } from '#/platform/detection';
import {} from '#/state/gallery';
import { AltTextCounterWrapper } from '#/view/com/composer/AltTextCounterWrapper';
import { atoms as a, useTheme } from '#/alf';
import { Button, ButtonText } from '#/components/Button';
import * as Dialog from '#/components/Dialog';
import {} from '#/components/Dialog';
import * as TextField from '#/components/forms/TextField';
import { CircleInfo_Stroke2_Corner0_Rounded as CircleInfo } from '#/components/icons/CircleInfo';
import { Text } from '#/components/Typography';
export const ImageAltTextDialog = ({ control, image, onChange, }) => {
    const [altText, setAltText] = React.useState(image.alt);
    return (_jsxs(Dialog.Outer, { control: control, onClose: () => {
            onChange({
                ...image,
                alt: enforceLen(altText, MAX_ALT_TEXT, true),
            });
        }, children: [_jsx(Dialog.Handle, {}), _jsx(ImageAltTextInner, { control: control, image: image, altText: altText, setAltText: setAltText })] }));
};
const ImageAltTextInner = ({ altText, setAltText, control, image, }) => {
    const { _, i18n } = useLingui();
    const t = useTheme();
    const windim = useWindowDimensions();
    const imageStyle = React.useMemo(() => {
        const maxWidth = isWeb ? 450 : windim.width;
        const source = image.transformed ?? image.source;
        if (source.height > source.width) {
            return {
                resizeMode: 'contain',
                width: '100%',
                aspectRatio: 1,
                borderRadius: 8,
            };
        }
        return {
            width: '100%',
            height: (maxWidth / source.width) * source.height,
            borderRadius: 8,
        };
    }, [image, windim]);
    return (_jsxs(Dialog.ScrollableInner, { label: _(msg `Add alt text`), children: [_jsx(Dialog.Close, {}), _jsxs(View, { children: [_jsx(Text, { style: [a.text_2xl, a.font_bold, a.leading_tight, a.pb_sm], children: _jsx(Trans, { children: "Add alt text" }) }), _jsx(View, { style: [t.atoms.bg_contrast_50, a.rounded_sm, a.overflow_hidden], children: _jsx(Image, { style: imageStyle, source: { uri: (image.transformed ?? image.source).path }, contentFit: "contain", accessible: true, accessibilityIgnoresInvertColors: true, enableLiveTextInteraction: true, autoplay: false }) })] }), _jsxs(View, { style: [a.mt_md, a.gap_md], children: [_jsxs(View, { style: [a.gap_sm], children: [_jsxs(View, { style: [a.relative, { width: '100%' }], children: [_jsx(TextField.LabelText, { children: _jsx(Trans, { children: "Descriptive alt text" }) }), _jsx(TextField.Root, { children: _jsx(Dialog.Input, { label: _(msg `Alt text`), onChangeText: text => {
                                                setAltText(text);
                                            }, defaultValue: altText, multiline: true, numberOfLines: 3, autoFocus: true }) })] }), altText.length > MAX_ALT_TEXT && (_jsxs(View, { style: [a.pb_sm, a.flex_row, a.gap_xs], children: [_jsx(CircleInfo, { fill: t.palette.negative_500 }), _jsx(Text, { style: [
                                            a.italic,
                                            a.leading_snug,
                                            t.atoms.text_contrast_medium,
                                        ], children: _jsxs(Trans, { children: ["Alt text will be truncated.", ' ', _jsx(Plural, { value: MAX_ALT_TEXT, other: `Limit: ${i18n.number(MAX_ALT_TEXT)} characters.` })] }) })] }))] }), _jsx(AltTextCounterWrapper, { altText: altText, children: _jsx(Button, { label: _(msg `Save`), disabled: altText === image.alt, size: "large", color: "primary", variant: "solid", onPress: () => {
                                control.close();
                            }, style: [a.flex_grow], children: _jsx(ButtonText, { children: _jsx(Trans, { children: "Save" }) }) }) })] }), isAndroid ? _jsx(View, { style: { height: 300 } }) : null] }));
};
//# sourceMappingURL=ImageAltTextDialog.js.map