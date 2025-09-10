import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import React from 'react';
import { View } from 'react-native';
import { AtUri, } from '@atproto/api';
import { msg, Trans } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { useQueryClient } from '@tanstack/react-query';
import isEqual from 'lodash.isequal';
import { logger } from '#/logger';
import { STALE } from '#/state/queries';
import { useMyListsQuery } from '#/state/queries/my-lists';
import { createPostgateQueryKey, getPostgateRecord, usePostgateQuery, useWritePostgateMutation, } from '#/state/queries/postgate';
import { createPostgateRecord, embeddingRules, } from '#/state/queries/postgate/util';
import { createThreadgateViewQueryKey, getThreadgateView, threadgateViewToAllowUISetting, useSetThreadgateAllowMutation, useThreadgateViewQuery, } from '#/state/queries/threadgate';
import { useAgent, useSession } from '#/state/session';
import * as Toast from '#/view/com/util/Toast';
import { atoms as a, useTheme } from '#/alf';
import { Button, ButtonIcon, ButtonText } from '#/components/Button';
import * as Dialog from '#/components/Dialog';
import { Divider } from '#/components/Divider';
import * as Toggle from '#/components/forms/Toggle';
import { Check_Stroke2_Corner0_Rounded as Check } from '#/components/icons/Check';
import { CircleInfo_Stroke2_Corner0_Rounded as CircleInfo } from '#/components/icons/CircleInfo';
import { Loader } from '#/components/Loader';
import { Text } from '#/components/Typography';
export function PostInteractionSettingsControlledDialog({ control, ...rest }) {
    const t = useTheme();
    const { _ } = useLingui();
    return (_jsxs(Dialog.Outer, { control: control, children: [_jsx(Dialog.Handle, {}), _jsxs(Dialog.ScrollableInner, { label: _(msg `Edit post interaction settings`), style: [{ maxWidth: 500 }, a.w_full], children: [_jsxs(View, { style: [a.gap_md], children: [_jsx(Header, {}), _jsx(PostInteractionSettingsForm, { ...rest }), _jsx(Text, { style: [
                                    a.pt_sm,
                                    a.text_sm,
                                    a.leading_snug,
                                    t.atoms.text_contrast_medium,
                                ], children: _jsxs(Trans, { children: ["You can set default interaction settings in", ' ', _jsx(Text, { style: [a.font_bold, t.atoms.text_contrast_medium], children: "Settings \u2192 Moderation \u2192 Interaction settings" }), "."] }) })] }), _jsx(Dialog.Close, {})] })] }));
}
export function Header() {
    return (_jsxs(View, { style: [a.gap_md, a.pb_sm], children: [_jsx(Text, { style: [a.text_2xl, a.font_bold], children: _jsx(Trans, { children: "Post interaction settings" }) }), _jsx(Text, { style: [a.text_md, a.pb_xs], children: _jsx(Trans, { children: "Customize who can interact with this post." }) }), _jsx(Divider, {})] }));
}
export function PostInteractionSettingsDialog(props) {
    return (_jsxs(Dialog.Outer, { control: props.control, children: [_jsx(Dialog.Handle, {}), _jsx(PostInteractionSettingsDialogControlledInner, { ...props })] }));
}
export function PostInteractionSettingsDialogControlledInner(props) {
    const { _ } = useLingui();
    const { currentAccount } = useSession();
    const [isSaving, setIsSaving] = React.useState(false);
    const { data: threadgateViewLoaded, isLoading: isLoadingThreadgate } = useThreadgateViewQuery({ postUri: props.rootPostUri });
    const { data: postgate, isLoading: isLoadingPostgate } = usePostgateQuery({
        postUri: props.postUri,
    });
    const { mutateAsync: writePostgateRecord } = useWritePostgateMutation();
    const { mutateAsync: setThreadgateAllow } = useSetThreadgateAllowMutation();
    const [editedPostgate, setEditedPostgate] = React.useState();
    const [editedAllowUISettings, setEditedAllowUISettings] = React.useState();
    const isLoading = isLoadingThreadgate || isLoadingPostgate;
    const threadgateView = threadgateViewLoaded || props.initialThreadgateView;
    const isThreadgateOwnedByViewer = React.useMemo(() => {
        return currentAccount?.did === new AtUri(props.rootPostUri).host;
    }, [props.rootPostUri, currentAccount?.did]);
    const postgateValue = React.useMemo(() => {
        return (editedPostgate || postgate || createPostgateRecord({ post: props.postUri }));
    }, [postgate, editedPostgate, props.postUri]);
    const allowUIValue = React.useMemo(() => {
        return (editedAllowUISettings || threadgateViewToAllowUISetting(threadgateView));
    }, [threadgateView, editedAllowUISettings]);
    const onSave = React.useCallback(async () => {
        if (!editedPostgate && !editedAllowUISettings) {
            props.control.close();
            return;
        }
        setIsSaving(true);
        try {
            const requests = [];
            if (editedPostgate) {
                requests.push(writePostgateRecord({
                    postUri: props.postUri,
                    postgate: editedPostgate,
                }));
            }
            if (editedAllowUISettings && isThreadgateOwnedByViewer) {
                requests.push(setThreadgateAllow({
                    postUri: props.rootPostUri,
                    allow: editedAllowUISettings,
                }));
            }
            await Promise.all(requests);
            props.control.close();
        }
        catch (e) {
            logger.error(`Failed to save post interaction settings`, {
                source: 'PostInteractionSettingsDialogControlledInner',
                safeMessage: e.message,
            });
            Toast.show(_(msg `There was an issue. Please check your internet connection and try again.`), 'xmark');
        }
        finally {
            setIsSaving(false);
        }
    }, [
        _,
        props.postUri,
        props.rootPostUri,
        props.control,
        editedPostgate,
        editedAllowUISettings,
        setIsSaving,
        writePostgateRecord,
        setThreadgateAllow,
        isThreadgateOwnedByViewer,
    ]);
    return (_jsx(Dialog.ScrollableInner, { label: _(msg `Edit post interaction settings`), style: [{ maxWidth: 500 }, a.w_full], children: _jsxs(View, { style: [a.gap_md], children: [_jsx(Header, {}), isLoading ? (_jsx(View, { style: [a.flex_1, a.py_4xl, a.align_center, a.justify_center], children: _jsx(Loader, { size: "xl" }) })) : (_jsx(PostInteractionSettingsForm, { replySettingsDisabled: !isThreadgateOwnedByViewer, isSaving: isSaving, onSave: onSave, postgate: postgateValue, onChangePostgate: setEditedPostgate, threadgateAllowUISettings: allowUIValue, onChangeThreadgateAllowUISettings: setEditedAllowUISettings }))] }) }));
}
export function PostInteractionSettingsForm({ canSave = true, onSave, isSaving, postgate, onChangePostgate, threadgateAllowUISettings, onChangeThreadgateAllowUISettings, replySettingsDisabled, }) {
    const t = useTheme();
    const { _ } = useLingui();
    const { data: lists } = useMyListsQuery('curate');
    const [quotesEnabled, setQuotesEnabled] = React.useState(!(postgate.embeddingRules &&
        postgate.embeddingRules.find(v => v.$type === embeddingRules.disableRule.$type)));
    const onPressAudience = (setting) => {
        // remove boolean values
        let newSelected = threadgateAllowUISettings.filter(v => v.type !== 'nobody' && v.type !== 'everybody');
        // toggle
        const i = newSelected.findIndex(v => isEqual(v, setting));
        if (i === -1) {
            newSelected.push(setting);
        }
        else {
            newSelected.splice(i, 1);
        }
        if (newSelected.length === 0) {
            newSelected.push({ type: 'everybody' });
        }
        onChangeThreadgateAllowUISettings(newSelected);
    };
    const onChangeQuotesEnabled = React.useCallback((enabled) => {
        setQuotesEnabled(enabled);
        onChangePostgate(createPostgateRecord({
            ...postgate,
            embeddingRules: enabled ? [] : [embeddingRules.disableRule],
        }));
    }, [setQuotesEnabled, postgate, onChangePostgate]);
    const noOneCanReply = !!threadgateAllowUISettings.find(v => v.type === 'nobody');
    return (_jsxs(View, { children: [_jsx(View, { style: [a.flex_1, a.gap_md], children: _jsxs(View, { style: [a.gap_lg], children: [_jsxs(View, { style: [a.gap_sm], children: [_jsx(Text, { style: [a.font_bold, a.text_lg], children: _jsx(Trans, { children: "Quote settings" }) }), _jsxs(Toggle.Item, { name: "quoteposts", type: "checkbox", label: quotesEnabled
                                        ? _(msg `Click to disable quote posts of this post.`)
                                        : _(msg `Click to enable quote posts of this post.`), value: quotesEnabled, onChange: onChangeQuotesEnabled, style: [a.justify_between, a.pt_xs], children: [_jsx(Text, { style: [t.atoms.text_contrast_medium], children: _jsx(Trans, { children: "Allow quote posts" }) }), _jsx(Toggle.Switch, {})] })] }), _jsx(Divider, {}), replySettingsDisabled && (_jsxs(View, { style: [
                                a.px_md,
                                a.py_sm,
                                a.rounded_sm,
                                a.flex_row,
                                a.align_center,
                                a.gap_sm,
                                t.atoms.bg_contrast_25,
                            ], children: [_jsx(CircleInfo, { fill: t.atoms.text_contrast_low.color }), _jsx(Text, { style: [
                                        a.flex_1,
                                        a.leading_snug,
                                        t.atoms.text_contrast_medium,
                                    ], children: _jsx(Trans, { children: "Reply settings are chosen by the author of the thread" }) })] })), _jsxs(View, { style: [
                                a.gap_sm,
                                {
                                    opacity: replySettingsDisabled ? 0.3 : 1,
                                },
                            ], children: [_jsx(Text, { style: [a.font_bold, a.text_lg], children: _jsx(Trans, { children: "Reply settings" }) }), _jsx(Text, { style: [a.pt_sm, t.atoms.text_contrast_medium], children: _jsx(Trans, { children: "Allow replies from:" }) }), _jsxs(View, { style: [a.flex_row, a.gap_sm], children: [_jsx(Selectable, { label: _(msg `Everybody`), isSelected: !!threadgateAllowUISettings.find(v => v.type === 'everybody'), onPress: () => onChangeThreadgateAllowUISettings([{ type: 'everybody' }]), style: { flex: 1 }, disabled: replySettingsDisabled }), _jsx(Selectable, { label: _(msg `Nobody`), isSelected: noOneCanReply, onPress: () => onChangeThreadgateAllowUISettings([{ type: 'nobody' }]), style: { flex: 1 }, disabled: replySettingsDisabled })] }), !noOneCanReply && (_jsxs(_Fragment, { children: [_jsx(Text, { style: [a.pt_sm, t.atoms.text_contrast_medium], children: _jsx(Trans, { children: "Or combine these options:" }) }), _jsxs(View, { style: [a.gap_sm], children: [_jsx(Selectable, { label: _(msg `Mentioned users`), isSelected: !!threadgateAllowUISettings.find(v => v.type === 'mention'), onPress: () => onPressAudience({ type: 'mention' }), disabled: replySettingsDisabled }), _jsx(Selectable, { label: _(msg `Users you follow`), isSelected: !!threadgateAllowUISettings.find(v => v.type === 'following'), onPress: () => onPressAudience({ type: 'following' }), disabled: replySettingsDisabled }), _jsx(Selectable, { label: _(msg `Your followers`), isSelected: !!threadgateAllowUISettings.find(v => v.type === 'followers'), onPress: () => onPressAudience({ type: 'followers' }), disabled: replySettingsDisabled }), lists && lists.length > 0
                                                    ? lists.map(list => (_jsx(Selectable, { label: _(msg `Users in "${list.name}"`), isSelected: !!threadgateAllowUISettings.find(v => v.type === 'list' && v.list === list.uri), onPress: () => onPressAudience({ type: 'list', list: list.uri }), disabled: replySettingsDisabled }, list.uri)))
                                                    : // No loading states to avoid jumps for the common case (no lists)
                                                        null] })] }))] })] }) }), _jsxs(Button, { disabled: !canSave || isSaving, label: _(msg `Save`), onPress: onSave, color: "primary", size: "large", variant: "solid", style: a.mt_xl, children: [_jsx(ButtonText, { children: _(msg `Save`) }), isSaving && _jsx(ButtonIcon, { icon: Loader, position: "right" })] })] }));
}
function Selectable({ label, isSelected, onPress, style, disabled, }) {
    const t = useTheme();
    return (_jsx(Button, { disabled: disabled, onPress: onPress, label: label, accessibilityRole: "checkbox", "aria-checked": isSelected, accessibilityState: {
            checked: isSelected,
        }, style: a.flex_1, children: ({ hovered, focused }) => (_jsxs(View, { style: [
                a.flex_1,
                a.flex_row,
                a.align_center,
                a.justify_between,
                a.rounded_sm,
                a.p_md,
                { minHeight: 40 }, // for consistency with checkmark icon visible or not
                t.atoms.bg_contrast_50,
                (hovered || focused) && t.atoms.bg_contrast_100,
                isSelected && {
                    backgroundColor: t.palette.primary_100,
                },
                style,
            ], children: [_jsx(Text, { style: [a.text_sm, isSelected && a.font_bold], children: label }), isSelected ? (_jsx(Check, { size: "sm", fill: t.palette.primary_500 })) : (_jsx(View, {}))] })) }));
}
export function usePrefetchPostInteractionSettings({ postUri, rootPostUri, }) {
    const queryClient = useQueryClient();
    const agent = useAgent();
    return React.useCallback(async () => {
        try {
            await Promise.all([
                queryClient.prefetchQuery({
                    queryKey: createPostgateQueryKey(postUri),
                    queryFn: () => getPostgateRecord({ agent, postUri }).then(res => res ?? null),
                    staleTime: STALE.SECONDS.THIRTY,
                }),
                queryClient.prefetchQuery({
                    queryKey: createThreadgateViewQueryKey(rootPostUri),
                    queryFn: () => getThreadgateView({ agent, postUri: rootPostUri }),
                    staleTime: STALE.SECONDS.THIRTY,
                }),
            ]);
        }
        catch (e) {
            logger.error(`Failed to prefetch post interaction settings`, {
                safeMessage: e.message,
            });
        }
    }, [queryClient, agent, postUri, rootPostUri]);
}
//# sourceMappingURL=PostInteractionSettingsDialog.js.map