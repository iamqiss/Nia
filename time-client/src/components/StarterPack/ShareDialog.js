import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { View } from 'react-native';
import { Image } from 'expo-image';
import {} from '@atproto/api';
import { msg, Trans } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { useSaveImageToMediaLibrary } from '#/lib/media/save-image';
import { shareUrl } from '#/lib/sharing';
import { getStarterPackOgCard } from '#/lib/strings/starter-pack';
import { logger } from '#/logger';
import { isNative, isWeb } from '#/platform/detection';
import { atoms as a, useBreakpoints, useTheme } from '#/alf';
import { Button, ButtonIcon, ButtonText } from '#/components/Button';
import {} from '#/components/Dialog';
import * as Dialog from '#/components/Dialog';
import { ChainLink_Stroke2_Corner0_Rounded as ChainLinkIcon } from '#/components/icons/ChainLink';
import { Download_Stroke2_Corner0_Rounded as DownloadIcon } from '#/components/icons/Download';
import { QrCode_Stroke2_Corner0_Rounded as QrCodeIcon } from '#/components/icons/QrCode';
import { Loader } from '#/components/Loader';
import { Text } from '#/components/Typography';
export function ShareDialog(props) {
    return (_jsxs(Dialog.Outer, { control: props.control, nativeOptions: { preventExpansion: true }, children: [_jsx(Dialog.Handle, {}), _jsx(ShareDialogInner, { ...props })] }));
}
function ShareDialogInner({ starterPack, link, imageLoaded, qrDialogControl, control, }) {
    const { _ } = useLingui();
    const t = useTheme();
    const { gtMobile } = useBreakpoints();
    const imageUrl = getStarterPackOgCard(starterPack);
    const onShareLink = async () => {
        if (!link)
            return;
        shareUrl(link);
        logger.metric('starterPack:share', {
            starterPack: starterPack.uri,
            shareType: 'link',
        });
        control.close();
    };
    const saveImageToAlbum = useSaveImageToMediaLibrary();
    const onSave = async () => {
        await saveImageToAlbum(imageUrl);
    };
    return (_jsx(_Fragment, { children: _jsxs(Dialog.ScrollableInner, { label: _(msg `Share link dialog`), children: [!imageLoaded || !link ? (_jsx(View, { style: [a.align_center, a.justify_center, { minHeight: 350 }], children: _jsx(Loader, { size: "xl" }) })) : (_jsxs(View, { style: [!gtMobile && a.gap_lg], children: [_jsxs(View, { style: [a.gap_sm, gtMobile && a.pb_lg], children: [_jsx(Text, { style: [a.font_bold, a.text_2xl], children: _jsx(Trans, { children: "Invite people to this starter pack!" }) }), _jsx(Text, { style: [a.text_md, t.atoms.text_contrast_medium], children: _jsx(Trans, { children: "Share this starter pack and help people join your community on Bluesky." }) })] }), _jsx(Image, { source: { uri: imageUrl }, style: [
                                a.rounded_sm,
                                {
                                    aspectRatio: 1200 / 630,
                                    transform: [{ scale: gtMobile ? 0.85 : 1 }],
                                    marginTop: gtMobile ? -20 : 0,
                                },
                            ], accessibilityIgnoresInvertColors: true }), _jsxs(View, { style: [
                                a.gap_md,
                                gtMobile && [
                                    a.gap_sm,
                                    a.justify_center,
                                    a.flex_row,
                                    a.flex_wrap,
                                ],
                            ], children: [_jsxs(Button, { label: isWeb ? _(msg `Copy link`) : _(msg `Share link`), color: "primary_subtle", size: "large", onPress: onShareLink, children: [_jsx(ButtonIcon, { icon: ChainLinkIcon }), _jsx(ButtonText, { children: isWeb ? _jsx(Trans, { children: "Copy Link" }) : _jsx(Trans, { children: "Share link" }) })] }), _jsxs(Button, { label: _(msg `Share QR code`), color: "primary_subtle", size: "large", onPress: () => {
                                        control.close(() => {
                                            qrDialogControl.open();
                                        });
                                    }, children: [_jsx(ButtonIcon, { icon: QrCodeIcon }), _jsx(ButtonText, { children: _jsx(Trans, { children: "Share QR code" }) })] }), isNative && (_jsxs(Button, { label: _(msg `Save image`), color: "secondary", size: "large", onPress: onSave, children: [_jsx(ButtonIcon, { icon: DownloadIcon }), _jsx(ButtonText, { children: _jsx(Trans, { children: "Save image" }) })] }))] })] })), _jsx(Dialog.Close, {})] }) }));
}
//# sourceMappingURL=ShareDialog.js.map