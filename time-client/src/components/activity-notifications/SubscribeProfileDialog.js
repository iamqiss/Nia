import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useMemo, useState } from 'react';
import { View } from 'react-native';
import {} from '@atproto/api';
import { msg, Trans } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { useMutation, useQueryClient, } from '@tanstack/react-query';
import { createSanitizedDisplayName } from '#/lib/moderation/create-sanitized-display-name';
import { cleanError } from '#/lib/strings/errors';
import { sanitizeHandle } from '#/lib/strings/handles';
import { logger } from '#/logger';
import { isWeb } from '#/platform/detection';
import { updateProfileShadow } from '#/state/cache/profile-shadow';
import { RQKEY_getActivitySubscriptions } from '#/state/queries/activity-subscriptions';
import { useAgent } from '#/state/session';
import * as Toast from '#/view/com/util/Toast';
import { platform, useTheme, web } from '#/alf';
import { atoms as a } from '#/alf';
import { Admonition } from '#/components/Admonition';
import { Button, ButtonIcon, ButtonText, } from '#/components/Button';
import * as Dialog from '#/components/Dialog';
import * as Toggle from '#/components/forms/Toggle';
import { Loader } from '#/components/Loader';
import * as ProfileCard from '#/components/ProfileCard';
import { Text } from '#/components/Typography';
export function SubscribeProfileDialog({ control, profile, moderationOpts, includeProfile, }) {
    return (_jsxs(Dialog.Outer, { control: control, nativeOptions: { preventExpansion: true }, children: [_jsx(Dialog.Handle, {}), _jsx(DialogInner, { profile: profile, moderationOpts: moderationOpts, includeProfile: includeProfile })] }));
}
function DialogInner({ profile, moderationOpts, includeProfile, }) {
    const { _ } = useLingui();
    const t = useTheme();
    const agent = useAgent();
    const control = Dialog.useDialogContext();
    const queryClient = useQueryClient();
    const initialState = parseActivitySubscription(profile.viewer?.activitySubscription);
    const [state, setState] = useState(initialState);
    const values = useMemo(() => {
        const { post, reply } = state;
        const res = [];
        if (post)
            res.push('post');
        if (reply)
            res.push('reply');
        return res;
    }, [state]);
    const onChange = (newValues) => {
        setState(oldValues => {
            // ensure you can't have reply without post
            if (!oldValues.reply && newValues.includes('reply')) {
                return {
                    post: true,
                    reply: true,
                };
            }
            if (oldValues.post && !newValues.includes('post')) {
                return {
                    post: false,
                    reply: false,
                };
            }
            return {
                post: newValues.includes('post'),
                reply: newValues.includes('reply'),
            };
        });
    };
    const { mutate: saveChanges, isPending: isSaving, error, } = useMutation({
        mutationFn: async (activitySubscription) => {
            await agent.app.bsky.notification.putActivitySubscription({
                subject: profile.did,
                activitySubscription,
            });
        },
        onSuccess: (_data, activitySubscription) => {
            control.close(() => {
                updateProfileShadow(queryClient, profile.did, {
                    activitySubscription,
                });
                if (!activitySubscription.post && !activitySubscription.reply) {
                    logger.metric('activitySubscription:disable', {});
                    Toast.show(_(msg `You will no longer receive notifications for ${sanitizeHandle(profile.handle, '@')}`), 'check');
                    // filter out the subscription
                    queryClient.setQueryData(RQKEY_getActivitySubscriptions, (old) => {
                        if (!old)
                            return old;
                        return {
                            ...old,
                            pages: old.pages.map(page => ({
                                ...page,
                                subscriptions: page.subscriptions.filter(item => item.did !== profile.did),
                            })),
                        };
                    });
                }
                else {
                    logger.metric('activitySubscription:enable', {
                        setting: activitySubscription.reply ? 'posts_and_replies' : 'posts',
                    });
                    if (!initialState.post && !initialState.reply) {
                        Toast.show(_(msg `You'll start receiving notifications for ${sanitizeHandle(profile.handle, '@')}!`), 'check');
                    }
                    else {
                        Toast.show(_(msg `Changes saved`), 'check');
                    }
                }
            });
        },
        onError: err => {
            logger.error('Could not save activity subscription', { message: err });
        },
    });
    const buttonProps = useMemo(() => {
        const isDirty = state.post !== initialState.post || state.reply !== initialState.reply;
        const hasAny = state.post || state.reply;
        if (isDirty) {
            return {
                label: _(msg `Save changes`),
                color: hasAny ? 'primary' : 'negative',
                onPress: () => saveChanges(state),
                disabled: isSaving,
            };
        }
        else {
            // on web, a disabled save button feels more natural than a massive close button
            if (isWeb) {
                return {
                    label: _(msg `Save changes`),
                    color: 'secondary',
                    disabled: true,
                };
            }
            else {
                return {
                    label: _(msg `Cancel`),
                    color: 'secondary',
                    onPress: () => control.close(),
                };
            }
        }
    }, [state, initialState, control, _, isSaving, saveChanges]);
    const name = createSanitizedDisplayName(profile, false);
    return (_jsxs(Dialog.ScrollableInner, { style: web({ maxWidth: 400 }), label: _(msg `Get notified of new posts from ${name}`), children: [_jsxs(View, { style: [a.gap_lg], children: [_jsxs(View, { style: [a.gap_xs], children: [_jsx(Text, { style: [a.font_heavy, a.text_2xl], children: _jsx(Trans, { children: "Keep me posted" }) }), _jsx(Text, { style: [t.atoms.text_contrast_medium, a.text_md], children: _jsx(Trans, { children: "Get notified of this account\u2019s activity" }) })] }), includeProfile && (_jsxs(ProfileCard.Header, { children: [_jsx(ProfileCard.Avatar, { profile: profile, moderationOpts: moderationOpts, disabledPreview: true }), _jsx(ProfileCard.NameAndHandle, { profile: profile, moderationOpts: moderationOpts })] })), _jsx(Toggle.Group, { label: _(msg `Subscribe to account activity`), values: values, onChange: onChange, children: _jsxs(View, { style: [a.gap_sm], children: [_jsxs(Toggle.Item, { label: _(msg `Posts`), name: "post", style: [
                                        a.flex_1,
                                        a.py_xs,
                                        platform({
                                            native: [a.justify_between],
                                            web: [a.flex_row_reverse, a.gap_sm],
                                        }),
                                    ], children: [_jsx(Toggle.LabelText, { style: [t.atoms.text, a.font_normal, a.text_md, a.flex_1], children: _jsx(Trans, { children: "Posts" }) }), _jsx(Toggle.Switch, {})] }), _jsxs(Toggle.Item, { label: _(msg `Replies`), name: "reply", style: [
                                        a.flex_1,
                                        a.py_xs,
                                        platform({
                                            native: [a.justify_between],
                                            web: [a.flex_row_reverse, a.gap_sm],
                                        }),
                                    ], children: [_jsx(Toggle.LabelText, { style: [t.atoms.text, a.font_normal, a.text_md, a.flex_1], children: _jsx(Trans, { children: "Replies" }) }), _jsx(Toggle.Switch, {})] })] }) }), error && (_jsx(Admonition, { type: "error", children: _jsxs(Trans, { children: ["Could not save changes: ", cleanError(error)] }) })), _jsxs(Button, { ...buttonProps, size: "large", variant: "solid", children: [_jsx(ButtonText, { children: buttonProps.label }), isSaving && _jsx(ButtonIcon, { icon: Loader })] })] }), _jsx(Dialog.Close, {})] }));
}
function parseActivitySubscription(sub) {
    if (!sub)
        return { post: false, reply: false };
    const { post, reply } = sub;
    return { post, reply };
}
//# sourceMappingURL=SubscribeProfileDialog.js.map