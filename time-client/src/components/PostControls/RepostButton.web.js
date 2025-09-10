import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { msg } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { useRequireAuth } from '#/state/session';
import { useSession } from '#/state/session';
import { EventStopper } from '#/view/com/util/EventStopper';
import { useTheme } from '#/alf';
import { CloseQuote_Stroke2_Corner1_Rounded as Quote } from '#/components/icons/Quote';
import { Repost_Stroke2_Corner2_Rounded as Repost } from '#/components/icons/Repost';
import * as Menu from '#/components/Menu';
import { PostControlButton, PostControlButtonIcon, PostControlButtonText, } from './PostControlButton';
import { useFormatPostStatCount } from './util';
export const RepostButton = ({ isReposted, repostCount, onRepost, onQuote, big, embeddingDisabled, }) => {
    const t = useTheme();
    const { _ } = useLingui();
    const { hasSession } = useSession();
    const requireAuth = useRequireAuth();
    const formatPostStatCount = useFormatPostStatCount();
    return hasSession ? (_jsx(EventStopper, { onKeyDown: false, children: _jsxs(Menu.Root, { children: [_jsx(Menu.Trigger, { label: _(msg `Repost or quote post`), children: ({ props }) => {
                        return (_jsxs(PostControlButton, { testID: "repostBtn", active: isReposted, activeColor: t.palette.positive_600, label: props.accessibilityLabel, big: big, ...props, children: [_jsx(PostControlButtonIcon, { icon: Repost }), typeof repostCount !== 'undefined' && repostCount > 0 && (_jsx(PostControlButtonText, { testID: "repostCount", children: formatPostStatCount(repostCount) }))] }));
                    } }), _jsxs(Menu.Outer, { style: { minWidth: 170 }, children: [_jsxs(Menu.Item, { label: isReposted
                                ? _(msg `Undo repost`)
                                : _(msg({ message: `Repost`, context: `action` })), testID: "repostDropdownRepostBtn", onPress: onRepost, children: [_jsx(Menu.ItemText, { children: isReposted
                                        ? _(msg `Undo repost`)
                                        : _(msg({ message: `Repost`, context: `action` })) }), _jsx(Menu.ItemIcon, { icon: Repost, position: "right" })] }), _jsxs(Menu.Item, { disabled: embeddingDisabled, label: embeddingDisabled
                                ? _(msg `Quote posts disabled`)
                                : _(msg `Quote post`), testID: "repostDropdownQuoteBtn", onPress: onQuote, children: [_jsx(Menu.ItemText, { children: embeddingDisabled
                                        ? _(msg `Quote posts disabled`)
                                        : _(msg `Quote post`) }), _jsx(Menu.ItemIcon, { icon: Quote, position: "right" })] })] })] }) })) : (_jsxs(PostControlButton, { onPress: () => requireAuth(() => { }), active: isReposted, activeColor: t.palette.positive_600, label: _(msg `Repost or quote post`), big: big, children: [_jsx(PostControlButtonIcon, { icon: Repost }), typeof repostCount !== 'undefined' && repostCount > 0 && (_jsx(PostControlButtonText, { testID: "repostCount", children: formatPostStatCount(repostCount) }))] }));
};
//# sourceMappingURL=RepostButton.web.js.map