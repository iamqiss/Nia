import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useCallback, useState } from 'react';
import { View } from 'react-native';
import { msg, Trans } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { saveBytesToDisk } from '#/lib/media/manip';
import { logger } from '#/logger';
import { useAgent } from '#/state/session';
import * as Toast from '#/view/com/util/Toast';
import { atoms as a, useTheme } from '#/alf';
import { Button, ButtonIcon, ButtonText } from '#/components/Button';
import * as Dialog from '#/components/Dialog';
import { Download_Stroke2_Corner0_Rounded as DownloadIcon } from '#/components/icons/Download';
import { InlineLinkText } from '#/components/Link';
import { Loader } from '#/components/Loader';
import { Text } from '#/components/Typography';
export function ExportCarDialog({ control, }) {
    const { _ } = useLingui();
    const t = useTheme();
    const agent = useAgent();
    const [loading, setLoading] = useState(false);
    const download = useCallback(async () => {
        if (!agent.session) {
            return; // shouldnt ever happen
        }
        try {
            setLoading(true);
            const did = agent.session.did;
            const downloadRes = await agent.com.atproto.sync.getRepo({ did });
            const saveRes = await saveBytesToDisk('repo.car', downloadRes.data, downloadRes.headers['content-type'] || 'application/vnd.ipld.car');
            if (saveRes) {
                Toast.show(_(msg `File saved successfully!`));
            }
        }
        catch (e) {
            logger.error('Error occurred while downloading CAR file', { message: e });
            Toast.show(_(msg `Error occurred while saving file`), 'xmark');
        }
        finally {
            setLoading(false);
            control.close();
        }
    }, [_, control, agent]);
    return (_jsxs(Dialog.Outer, { control: control, nativeOptions: { preventExpansion: true }, children: [_jsx(Dialog.Handle, {}), _jsx(Dialog.ScrollableInner, { accessibilityDescribedBy: "dialog-description", accessibilityLabelledBy: "dialog-title", children: _jsxs(View, { style: [a.relative, a.gap_lg, a.w_full], children: [_jsx(Text, { nativeID: "dialog-title", style: [a.text_2xl, a.font_heavy], children: _jsx(Trans, { children: "Export My Data" }) }), _jsx(Text, { nativeID: "dialog-description", style: [a.text_sm, a.leading_snug, t.atoms.text_contrast_high], children: _jsx(Trans, { children: "Your account repository, containing all public data records, can be downloaded as a \"CAR\" file. This file does not include media embeds, such as images, or your private data, which must be fetched separately." }) }), _jsxs(Button, { color: "primary", size: "large", label: _(msg `Download CAR file`), disabled: loading, onPress: download, children: [_jsx(ButtonIcon, { icon: DownloadIcon }), _jsx(ButtonText, { children: _jsx(Trans, { children: "Download CAR file" }) }), loading && _jsx(ButtonIcon, { icon: Loader })] }), _jsx(Text, { style: [
                                t.atoms.text_contrast_medium,
                                a.text_sm,
                                a.leading_snug,
                                a.flex_1,
                            ], children: _jsxs(Trans, { children: ["This feature is in beta. You can read more about repository exports in", ' ', _jsx(InlineLinkText, { label: _(msg `View blogpost for more details`), to: "https://docs.bsky.app/blog/repo-export", style: [a.text_sm], children: "this blogpost" }), "."] }) })] }) })] }));
}
//# sourceMappingURL=ExportCarDialog.js.map