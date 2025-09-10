import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { AtUri } from '@atproto/api';
import { msg, Trans } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useRequireEmailVerification } from '#/lib/hooks/useRequireEmailVerification';
import {} from '#/lib/routes/types';
import {} from '#/lib/routes/types';
import { useModalControls } from '#/state/modals';
import { useSetMinimalShellMode } from '#/state/shell';
import { MyLists } from '#/view/com/lists/MyLists';
import { atoms as a } from '#/alf';
import { Button, ButtonIcon, ButtonText } from '#/components/Button';
import { PlusLarge_Stroke2_Corner0_Rounded as PlusIcon } from '#/components/icons/Plus';
import * as Layout from '#/components/Layout';
export function ModerationModlistsScreen({}) {
    const { _ } = useLingui();
    const setMinimalShellMode = useSetMinimalShellMode();
    const navigation = useNavigation();
    const { openModal } = useModalControls();
    const requireEmailVerification = useRequireEmailVerification();
    useFocusEffect(React.useCallback(() => {
        setMinimalShellMode(false);
    }, [setMinimalShellMode]));
    const onPressNewList = React.useCallback(() => {
        openModal({
            name: 'create-or-edit-list',
            purpose: 'app.bsky.graph.defs#modlist',
            onSave: (uri) => {
                try {
                    const urip = new AtUri(uri);
                    navigation.navigate('ProfileList', {
                        name: urip.hostname,
                        rkey: urip.rkey,
                    });
                }
                catch { }
            },
        });
    }, [openModal, navigation]);
    const wrappedOnPressNewList = requireEmailVerification(onPressNewList, {
        instructions: [
            _jsx(Trans, { children: "Before creating a list, you must first verify your email." }, "modlist"),
        ],
    });
    return (_jsxs(Layout.Screen, { testID: "moderationModlistsScreen", children: [_jsxs(Layout.Header.Outer, { children: [_jsx(Layout.Header.BackButton, {}), _jsx(Layout.Header.Content, { align: "left", children: _jsx(Layout.Header.TitleText, { children: _jsx(Trans, { children: "Moderation Lists" }) }) }), _jsxs(Button, { label: _(msg `New list`), testID: "newModListBtn", color: "secondary", variant: "solid", size: "small", onPress: wrappedOnPressNewList, children: [_jsx(ButtonIcon, { icon: PlusIcon }), _jsx(ButtonText, { children: _jsx(Trans, { context: "action", children: "New" }) })] })] }), _jsx(MyLists, { filter: "mod", style: a.flex_grow })] }));
}
//# sourceMappingURL=ModerationModlists.js.map