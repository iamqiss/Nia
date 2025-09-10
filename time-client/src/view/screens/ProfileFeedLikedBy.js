import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { msg } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { useFocusEffect } from '@react-navigation/native';
import {} from '#/lib/routes/types';
import { makeRecordUri } from '#/lib/strings/url-helpers';
import { useSetMinimalShellMode } from '#/state/shell';
import { PostLikedBy as PostLikedByComponent } from '#/view/com/post-thread/PostLikedBy';
import { ViewHeader } from '#/view/com/util/ViewHeader';
import { CenteredView } from '#/view/com/util/Views';
import * as Layout from '#/components/Layout';
export const ProfileFeedLikedByScreen = ({ route }) => {
    const setMinimalShellMode = useSetMinimalShellMode();
    const { name, rkey } = route.params;
    const uri = makeRecordUri(name, 'app.bsky.feed.generator', rkey);
    const { _ } = useLingui();
    useFocusEffect(React.useCallback(() => {
        setMinimalShellMode(false);
    }, [setMinimalShellMode]));
    return (_jsx(Layout.Screen, { testID: "postLikedByScreen", children: _jsxs(CenteredView, { sideBorders: true, children: [_jsx(ViewHeader, { title: _(msg `Liked By`) }), _jsx(PostLikedByComponent, { uri: uri })] }) }));
};
//# sourceMappingURL=ProfileFeedLikedBy.js.map