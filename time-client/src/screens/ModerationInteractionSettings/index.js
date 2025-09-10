import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import React from 'react';
import { View } from 'react-native';
import { msg, Trans } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import deepEqual from 'lodash.isequal';
import { logger } from '#/logger';
import { usePostInteractionSettingsMutation } from '#/state/queries/post-interaction-settings';
import { createPostgateRecord } from '#/state/queries/postgate/util';
import { usePreferencesQuery, } from '#/state/queries/preferences';
import { threadgateAllowUISettingToAllowRecordValue, threadgateRecordToAllowUISetting, } from '#/state/queries/threadgate';
import * as Toast from '#/view/com/util/Toast';
import { atoms as a, useGutters } from '#/alf';
import { Admonition } from '#/components/Admonition';
import { PostInteractionSettingsForm } from '#/components/dialogs/PostInteractionSettingsDialog';
import * as Layout from '#/components/Layout';
import { Loader } from '#/components/Loader';
export function Screen() {
    const gutters = useGutters(['base']);
    const { data: preferences } = usePreferencesQuery();
    return (_jsxs(Layout.Screen, { testID: "ModerationInteractionSettingsScreen", children: [_jsxs(Layout.Header.Outer, { children: [_jsx(Layout.Header.BackButton, {}), _jsx(Layout.Header.Content, { children: _jsx(Layout.Header.TitleText, { children: _jsx(Trans, { children: "Post Interaction Settings" }) }) }), _jsx(Layout.Header.Slot, {})] }), _jsx(Layout.Content, { children: _jsxs(View, { style: [gutters, a.gap_xl], children: [_jsx(Admonition, { type: "tip", children: _jsx(Trans, { children: "The following settings will be used as your defaults when creating new posts. You can edit these for a specific post from the composer." }) }), preferences ? (_jsx(Inner, { preferences: preferences })) : (_jsx(View, { style: [gutters, a.justify_center, a.align_center], children: _jsx(Loader, { size: "xl" }) }))] }) })] }));
}
function Inner({ preferences }) {
    const { _ } = useLingui();
    const { mutateAsync: setPostInteractionSettings, isPending } = usePostInteractionSettingsMutation();
    const [error, setError] = React.useState(undefined);
    const allowUI = React.useMemo(() => {
        return threadgateRecordToAllowUISetting({
            $type: 'app.bsky.feed.threadgate',
            post: '',
            createdAt: new Date().toString(),
            allow: preferences.postInteractionSettings.threadgateAllowRules,
        });
    }, [preferences.postInteractionSettings.threadgateAllowRules]);
    const postgate = React.useMemo(() => {
        return createPostgateRecord({
            post: '',
            embeddingRules: preferences.postInteractionSettings.postgateEmbeddingRules,
        });
    }, [preferences.postInteractionSettings.postgateEmbeddingRules]);
    const [maybeEditedAllowUI, setAllowUI] = React.useState(allowUI);
    const [maybeEditedPostgate, setEditedPostgate] = React.useState(postgate);
    const wasEdited = React.useMemo(() => {
        return (!deepEqual(allowUI, maybeEditedAllowUI) ||
            !deepEqual(postgate.embeddingRules, maybeEditedPostgate.embeddingRules));
    }, [postgate, allowUI, maybeEditedAllowUI, maybeEditedPostgate]);
    const onSave = React.useCallback(async () => {
        setError('');
        try {
            await setPostInteractionSettings({
                threadgateAllowRules: threadgateAllowUISettingToAllowRecordValue(maybeEditedAllowUI),
                postgateEmbeddingRules: maybeEditedPostgate.embeddingRules ?? [],
            });
            Toast.show(_(msg({ message: 'Settings saved', context: 'toast' })));
        }
        catch (e) {
            logger.error(`Failed to save post interaction settings`, {
                source: 'ModerationInteractionSettingsScreen',
                safeMessage: e.message,
            });
            setError(_(msg `Failed to save settings. Please try again.`));
        }
    }, [_, maybeEditedPostgate, maybeEditedAllowUI, setPostInteractionSettings]);
    return (_jsxs(_Fragment, { children: [_jsx(PostInteractionSettingsForm, { canSave: wasEdited, isSaving: isPending, onSave: onSave, postgate: maybeEditedPostgate, onChangePostgate: setEditedPostgate, threadgateAllowUISettings: maybeEditedAllowUI, onChangeThreadgateAllowUISettings: setAllowUI }), error && _jsx(Admonition, { type: "error", children: error })] }));
}
//# sourceMappingURL=index.js.map