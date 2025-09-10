import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { Plural, Trans } from '@lingui/macro';
import { useFocusEffect } from '@react-navigation/native';
import {} from '#/lib/routes/types';
import { makeRecordUri } from '#/lib/strings/url-helpers';
import { usePostThreadQuery } from '#/state/queries/post-thread';
import { useSetMinimalShellMode } from '#/state/shell';
import { PostLikedBy as PostLikedByComponent } from '#/view/com/post-thread/PostLikedBy';
import * as Layout from '#/components/Layout';
export const PostLikedByScreen = ({ route }) => {
    const setMinimalShellMode = useSetMinimalShellMode();
    const { name, rkey } = route.params;
    const uri = makeRecordUri(name, 'app.bsky.feed.post', rkey);
    const { data: post } = usePostThreadQuery(uri);
    let likeCount;
    if (post?.thread.type === 'post') {
        likeCount = post.thread.post.likeCount;
    }
    useFocusEffect(React.useCallback(() => {
        setMinimalShellMode(false);
    }, [setMinimalShellMode]));
    return (_jsxs(Layout.Screen, { children: [_jsxs(Layout.Header.Outer, { children: [_jsx(Layout.Header.BackButton, {}), _jsx(Layout.Header.Content, { children: post && (_jsxs(_Fragment, { children: [_jsx(Layout.Header.TitleText, { children: _jsx(Trans, { children: "Liked By" }) }), _jsx(Layout.Header.SubtitleText, { children: _jsx(Plural, { value: likeCount ?? 0, one: "# like", other: "# likes" }) })] })) }), _jsx(Layout.Header.Slot, {})] }), _jsx(PostLikedByComponent, { uri: uri })] }));
};
//# sourceMappingURL=PostLikedBy.js.map