import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { msg } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { useFocusEffect } from '@react-navigation/native';
import {} from '#/lib/routes/types';
import { makeRecordUri } from '#/lib/strings/url-helpers';
import { useSetMinimalShellMode } from '#/state/shell';
import { ViewHeader } from '#/view/com/util/ViewHeader';
import * as Layout from '#/components/Layout';
import { LikedByList } from '#/components/LikedByList';
export function ProfileLabelerLikedByScreen({ route, }) {
    const setMinimalShellMode = useSetMinimalShellMode();
    const { name: handleOrDid } = route.params;
    const uri = makeRecordUri(handleOrDid, 'app.bsky.labeler.service', 'self');
    const { _ } = useLingui();
    useFocusEffect(React.useCallback(() => {
        setMinimalShellMode(false);
    }, [setMinimalShellMode]));
    return (_jsxs(Layout.Screen, { children: [_jsx(ViewHeader, { title: _(msg `Liked By`) }), _jsx(LikedByList, { uri: uri })] }));
}
//# sourceMappingURL=ProfileLabelerLikedBy.js.map