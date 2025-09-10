import { jsx as _jsx } from "react/jsx-runtime";
import { useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import {} from '#/lib/routes/types';
import { makeRecordUri } from '#/lib/strings/url-helpers';
import { useSetMinimalShellMode } from '#/state/shell';
import { PostThread } from '#/screens/PostThread';
import * as Layout from '#/components/Layout';
export function PostThreadScreen({ route }) {
    const setMinimalShellMode = useSetMinimalShellMode();
    const { name, rkey } = route.params;
    const uri = makeRecordUri(name, 'app.bsky.feed.post', rkey);
    useFocusEffect(useCallback(() => {
        setMinimalShellMode(false);
    }, [setMinimalShellMode]));
    return (_jsx(Layout.Screen, { testID: "postThreadScreen", children: _jsx(PostThread, { uri: uri }) }));
}
//# sourceMappingURL=PostThread.js.map