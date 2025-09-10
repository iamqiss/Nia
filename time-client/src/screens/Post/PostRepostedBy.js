import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { Plural, Trans } from '@lingui/macro';
import { useFocusEffect } from '@react-navigation/native';
import {} from '#/lib/routes/types';
import { makeRecordUri } from '#/lib/strings/url-helpers';
import { usePostThreadQuery } from '#/state/queries/post-thread';
import { useSetMinimalShellMode } from '#/state/shell';
import { PostRepostedBy as PostRepostedByComponent } from '#/view/com/post-thread/PostRepostedBy';
import * as Layout from '#/components/Layout';
export const PostRepostedByScreen = ({ route }) => {
    const { name, rkey } = route.params;
    const uri = makeRecordUri(name, 'app.bsky.feed.post', rkey);
    const setMinimalShellMode = useSetMinimalShellMode();
    const { data: post } = usePostThreadQuery(uri);
    let quoteCount;
    if (post?.thread.type === 'post') {
        quoteCount = post.thread.post.repostCount;
    }
    useFocusEffect(React.useCallback(() => {
        setMinimalShellMode(false);
    }, [setMinimalShellMode]));
    return (_jsxs(Layout.Screen, { children: [_jsxs(Layout.Header.Outer, { children: [_jsx(Layout.Header.BackButton, {}), _jsx(Layout.Header.Content, { children: post && (_jsxs(_Fragment, { children: [_jsx(Layout.Header.TitleText, { children: _jsx(Trans, { children: "Reposted By" }) }), _jsx(Layout.Header.SubtitleText, { children: _jsx(Plural, { value: quoteCount ?? 0, one: "# repost", other: "# reposts" }) })] })) }), _jsx(Layout.Header.Slot, {})] }), _jsx(PostRepostedByComponent, { uri: uri })] }));
};
//# sourceMappingURL=PostRepostedBy.js.map