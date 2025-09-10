import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { memo, useMemo } from 'react';
import * as ExpoClipboard from 'expo-clipboard';
import { AtUri } from '@atproto/api';
import { msg, Trans } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { useNavigation } from '@react-navigation/native';
import { makeProfileLink } from '#/lib/routes/links';
import {} from '#/lib/routes/types';
import { shareText, shareUrl } from '#/lib/sharing';
import { toShareUrl } from '#/lib/strings/url-helpers';
import { logger } from '#/logger';
import { isIOS } from '#/platform/detection';
import { useAgeAssurance } from '#/state/ageAssurance/useAgeAssurance';
import { useProfileShadow } from '#/state/cache/profile-shadow';
import { useSession } from '#/state/session';
import * as Toast from '#/view/com/util/Toast';
import { atoms as a } from '#/alf';
import { Admonition } from '#/components/Admonition';
import { useDialogControl } from '#/components/Dialog';
import { SendViaChatDialog } from '#/components/dms/dialogs/ShareViaChatDialog';
import { ArrowOutOfBoxModified_Stroke2_Corner2_Rounded as ArrowOutOfBoxIcon } from '#/components/icons/ArrowOutOfBox';
import { ChainLink_Stroke2_Corner0_Rounded as ChainLinkIcon } from '#/components/icons/ChainLink';
import { Clipboard_Stroke2_Corner2_Rounded as ClipboardIcon } from '#/components/icons/Clipboard';
import { PaperPlane_Stroke2_Corner0_Rounded as PaperPlaneIcon } from '#/components/icons/PaperPlane';
import * as Menu from '#/components/Menu';
import { useDevMode } from '#/storage/hooks/dev-mode';
import { RecentChats } from './RecentChats';
import {} from './ShareMenuItems.types';
let ShareMenuItems = ({ post, onShare: onShareProp, }) => {
    const { hasSession } = useSession();
    const { _ } = useLingui();
    const navigation = useNavigation();
    const sendViaChatControl = useDialogControl();
    const [devModeEnabled] = useDevMode();
    const { isAgeRestricted } = useAgeAssurance();
    const postUri = post.uri;
    const postAuthor = useProfileShadow(post.author);
    const href = useMemo(() => {
        const urip = new AtUri(postUri);
        return makeProfileLink(postAuthor, 'post', urip.rkey);
    }, [postUri, postAuthor]);
    const hideInPWI = useMemo(() => {
        return !!postAuthor.labels?.find(label => label.val === '!no-unauthenticated');
    }, [postAuthor]);
    const onSharePost = () => {
        logger.metric('share:press:nativeShare', {}, { statsig: true });
        const url = toShareUrl(href);
        shareUrl(url);
        onShareProp();
    };
    const onCopyLink = async () => {
        logger.metric('share:press:copyLink', {}, { statsig: true });
        const url = toShareUrl(href);
        if (isIOS) {
            // iOS only
            await ExpoClipboard.setUrlAsync(url);
        }
        else {
            await ExpoClipboard.setStringAsync(url);
        }
        Toast.show(_(msg `Copied to clipboard`), 'clipboard-check');
        onShareProp();
    };
    const onSelectChatToShareTo = (conversation) => {
        navigation.navigate('MessagesConversation', {
            conversation,
            embed: postUri,
        });
    };
    const onShareATURI = () => {
        shareText(postUri);
    };
    const onShareAuthorDID = () => {
        shareText(postAuthor.did);
    };
    return (_jsxs(_Fragment, { children: [_jsxs(Menu.Outer, { children: [hasSession && !isAgeRestricted && (_jsxs(Menu.Group, { children: [_jsx(Menu.ContainerItem, { children: _jsx(RecentChats, { postUri: postUri }) }), _jsxs(Menu.Item, { testID: "postDropdownSendViaDMBtn", label: _(msg `Send via direct message`), onPress: () => {
                                    logger.metric('share:press:openDmSearch', {}, { statsig: true });
                                    sendViaChatControl.open();
                                }, children: [_jsx(Menu.ItemText, { children: _jsx(Trans, { children: "Send via direct message" }) }), _jsx(Menu.ItemIcon, { icon: PaperPlaneIcon, position: "right" })] })] })), _jsxs(Menu.Group, { children: [_jsxs(Menu.Item, { testID: "postDropdownShareBtn", label: _(msg `Share via...`), onPress: onSharePost, children: [_jsx(Menu.ItemText, { children: _jsx(Trans, { children: "Share via..." }) }), _jsx(Menu.ItemIcon, { icon: ArrowOutOfBoxIcon, position: "right" })] }), _jsxs(Menu.Item, { testID: "postDropdownShareBtn", label: _(msg `Copy link to post`), onPress: onCopyLink, children: [_jsx(Menu.ItemText, { children: _jsx(Trans, { children: "Copy link to post" }) }), _jsx(Menu.ItemIcon, { icon: ChainLinkIcon, position: "right" })] })] }), hideInPWI && (_jsx(Menu.Group, { children: _jsx(Menu.ContainerItem, { children: _jsx(Admonition, { type: "warning", style: [a.flex_1, a.border_0, a.p_0], children: _jsx(Trans, { children: "This post is only visible to logged-in users." }) }) }) })), devModeEnabled && (_jsxs(Menu.Group, { children: [_jsxs(Menu.Item, { testID: "postAtUriShareBtn", label: _(msg `Share post at:// URI`), onPress: onShareATURI, children: [_jsx(Menu.ItemText, { children: _jsx(Trans, { children: "Share post at:// URI" }) }), _jsx(Menu.ItemIcon, { icon: ClipboardIcon, position: "right" })] }), _jsxs(Menu.Item, { testID: "postAuthorDIDShareBtn", label: _(msg `Share author DID`), onPress: onShareAuthorDID, children: [_jsx(Menu.ItemText, { children: _jsx(Trans, { children: "Share author DID" }) }), _jsx(Menu.ItemIcon, { icon: ClipboardIcon, position: "right" })] })] }))] }), _jsx(SendViaChatDialog, { control: sendViaChatControl, onSelectChat: onSelectChatToShareTo })] }));
};
ShareMenuItems = memo(ShareMenuItems);
export { ShareMenuItems };
//# sourceMappingURL=ShareMenuItems.js.map