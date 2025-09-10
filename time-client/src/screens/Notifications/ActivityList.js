import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { msg, Trans } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import {} from '@react-navigation/native-stack';
import {} from '#/lib/routes/types';
import { PostFeed } from '#/view/com/posts/PostFeed';
import { EmptyState } from '#/view/com/util/EmptyState';
import * as Layout from '#/components/Layout';
import { ListFooter } from '#/components/Lists';
export function NotificationsActivityListScreen({ route: { params: { posts }, }, }) {
    const uris = decodeURIComponent(posts);
    const { _ } = useLingui();
    return (_jsxs(Layout.Screen, { testID: "NotificationsActivityListScreen", children: [_jsxs(Layout.Header.Outer, { children: [_jsx(Layout.Header.BackButton, {}), _jsx(Layout.Header.Content, { children: _jsx(Layout.Header.TitleText, { children: _jsx(Trans, { children: "Notifications" }) }) }), _jsx(Layout.Header.Slot, {})] }), _jsx(PostFeed, { feed: `posts|${uris}`, disablePoll: true, renderEmptyState: () => (_jsx(EmptyState, { icon: "growth", message: _(msg `No posts here`) })), renderEndOfFeed: () => _jsx(ListFooter, {}) })] }));
}
//# sourceMappingURL=ActivityList.js.map