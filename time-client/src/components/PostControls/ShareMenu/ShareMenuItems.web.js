import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { memo, useMemo } from 'react';
import { AtUri } from '@atproto/api';
import { msg, Trans } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { useNavigation } from '@react-navigation/native';
import { makeProfileLink } from '#/lib/routes/links';
import {} from '#/lib/routes/types';
import { shareText, shareUrl } from '#/lib/sharing';
import { toShareUrl } from '#/lib/strings/url-helpers';
import { logger } from '#/logger';
import { isWeb } from '#/platform/detection';
import { useAgeAssurance } from '#/state/ageAssurance/useAgeAssurance';
import { useProfileShadow } from '#/state/cache/profile-shadow';
import { useSession } from '#/state/session';
import { useBreakpoints } from '#/alf';
import { useDialogControl } from '#/components/Dialog';
import { EmbedDialog } from '#/components/dialogs/Embed';
import { SendViaChatDialog } from '#/components/dms/dialogs/ShareViaChatDialog';
import { ChainLink_Stroke2_Corner0_Rounded as ChainLinkIcon } from '#/components/icons/ChainLink';
import { Clipboard_Stroke2_Corner2_Rounded as ClipboardIcon } from '#/components/icons/Clipboard';
import { CodeBrackets_Stroke2_Corner0_Rounded as CodeBracketsIcon } from '#/components/icons/CodeBrackets';
import { PaperPlane_Stroke2_Corner0_Rounded as Send } from '#/components/icons/PaperPlane';
import * as Menu from '#/components/Menu';
import { useDevMode } from '#/storage/hooks/dev-mode';
import {} from './ShareMenuItems.types';
let ShareMenuItems = ({ post, record, timestamp, onShare: onShareProp, }) => {
    const { hasSession } = useSession();
    const { gtMobile } = useBreakpoints();
    const { _ } = useLingui();
    const navigation = useNavigation();
    const embedPostControl = useDialogControl();
    const sendViaChatControl = useDialogControl();
    const [devModeEnabled] = useDevMode();
    const { isAgeRestricted } = useAgeAssurance();
    const postUri = post.uri;
    const postCid = post.cid;
    const postAuthor = useProfileShadow(post.author);
    const href = useMemo(() => {
        const urip = new AtUri(postUri);
        return makeProfileLink(postAuthor, 'post', urip.rkey);
    }, [postUri, postAuthor]);
    const hideInPWI = useMemo(() => {
        return !!postAuthor.labels?.find(label => label.val === '!no-unauthenticated');
    }, [postAuthor]);
    const onCopyLink = () => {
        logger.metric('share:press:copyLink', {}, { statsig: true });
        const url = toShareUrl(href);
        shareUrl(url);
        onShareProp();
    };
    const onSelectChatToShareTo = (conversation) => {
        logger.metric('share:press:dmSelected', {}, { statsig: true });
        navigation.navigate('MessagesConversation', {
            conversation,
            embed: postUri,
        });
    };
    const canEmbed = isWeb && gtMobile && !hideInPWI;
    const onShareATURI = () => {
        shareText(postUri);
    };
    const onShareAuthorDID = () => {
        shareText(postAuthor.did);
    };
    const copyLinkItem = (_jsxs(Menu.Item, { testID: "postDropdownShareBtn", label: _(msg `Copy link to post`), onPress: onCopyLink, children: [_jsx(Menu.ItemText, { children: _jsx(Trans, { children: "Copy link to post" }) }), _jsx(Menu.ItemIcon, { icon: ChainLinkIcon, position: "right" })] }));
    return (_jsxs(_Fragment, { children: [_jsxs(Menu.Outer, { children: [!hideInPWI && copyLinkItem, hasSession && !isAgeRestricted && (_jsxs(Menu.Item, { testID: "postDropdownSendViaDMBtn", label: _(msg `Send via direct message`), onPress: () => {
                            logger.metric('share:press:openDmSearch', {}, { statsig: true });
                            sendViaChatControl.open();
                        }, children: [_jsx(Menu.ItemText, { children: _jsx(Trans, { children: "Send via direct message" }) }), _jsx(Menu.ItemIcon, { icon: Send, position: "right" })] })), canEmbed && (_jsxs(Menu.Item, { testID: "postDropdownEmbedBtn", label: _(msg `Embed post`), onPress: () => {
                            logger.metric('share:press:embed', {}, { statsig: true });
                            embedPostControl.open();
                        }, children: [_jsx(Menu.ItemText, { children: _(msg `Embed post`) }), _jsx(Menu.ItemIcon, { icon: CodeBracketsIcon, position: "right" })] })), hideInPWI && (_jsxs(_Fragment, { children: [hasSession && _jsx(Menu.Divider, {}), copyLinkItem, _jsx(Menu.LabelText, { style: { maxWidth: 220 }, children: _jsx(Trans, { children: "Note: This post is only visible to logged-in users." }) })] })), devModeEnabled && (_jsxs(_Fragment, { children: [_jsx(Menu.Divider, {}), _jsxs(Menu.Item, { testID: "postAtUriShareBtn", label: _(msg `Copy post at:// URI`), onPress: onShareATURI, children: [_jsx(Menu.ItemText, { children: _jsx(Trans, { children: "Copy post at:// URI" }) }), _jsx(Menu.ItemIcon, { icon: ClipboardIcon, position: "right" })] }), _jsxs(Menu.Item, { testID: "postAuthorDIDShareBtn", label: _(msg `Copy author DID`), onPress: onShareAuthorDID, children: [_jsx(Menu.ItemText, { children: _jsx(Trans, { children: "Copy author DID" }) }), _jsx(Menu.ItemIcon, { icon: ClipboardIcon, position: "right" })] })] }))] }), canEmbed && (_jsx(EmbedDialog, { control: embedPostControl, postCid: postCid, postUri: postUri, record: record, postAuthor: postAuthor, timestamp: timestamp })), _jsx(SendViaChatDialog, { control: sendViaChatControl, onSelectChat: onSelectChatToShareTo })] }));
};
ShareMenuItems = memo(ShareMenuItems);
export { ShareMenuItems };
//# sourceMappingURL=ShareMenuItems.web.js.map