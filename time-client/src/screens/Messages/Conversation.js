import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useCallback, useEffect } from 'react';
import { View } from 'react-native';
import { moderateProfile, } from '@atproto/api';
import { msg, Trans } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { useFocusEffect, useNavigation, useRoute, } from '@react-navigation/native';
import {} from '@react-navigation/native-stack';
import { useEnableKeyboardControllerScreen } from '#/lib/hooks/useEnableKeyboardController';
import { useNonReactiveCallback } from '#/lib/hooks/useNonReactiveCallback';
import {} from '#/lib/routes/types';
import { isWeb } from '#/platform/detection';
import { useMaybeProfileShadow } from '#/state/cache/profile-shadow';
import { useEmail } from '#/state/email-verification';
import { ConvoProvider, isConvoActive, useConvo } from '#/state/messages/convo';
import { ConvoStatus } from '#/state/messages/convo/types';
import { useCurrentConvoId } from '#/state/messages/current-convo-id';
import { useModerationOpts } from '#/state/preferences/moderation-opts';
import { useProfileQuery } from '#/state/queries/profile';
import { useSetMinimalShellMode } from '#/state/shell';
import { MessagesList } from '#/screens/Messages/components/MessagesList';
import { atoms as a, useBreakpoints, useTheme, web } from '#/alf';
import { AgeRestrictedScreen } from '#/components/ageAssurance/AgeRestrictedScreen';
import { useAgeAssuranceCopy } from '#/components/ageAssurance/useAgeAssuranceCopy';
import { EmailDialogScreenID, useEmailDialogControl, } from '#/components/dialogs/EmailDialog';
import { MessagesListBlockedFooter } from '#/components/dms/MessagesListBlockedFooter';
import { MessagesListHeader } from '#/components/dms/MessagesListHeader';
import { Error } from '#/components/Error';
import * as Layout from '#/components/Layout';
import { Loader } from '#/components/Loader';
export function MessagesConversationScreen(props) {
    const { _ } = useLingui();
    const aaCopy = useAgeAssuranceCopy();
    return (_jsx(AgeRestrictedScreen, { screenTitle: _(msg `Conversation`), infoText: aaCopy.chatsInfoText, children: _jsx(MessagesConversationScreenInner, { ...props }) }));
}
export function MessagesConversationScreenInner({ route }) {
    const { gtMobile } = useBreakpoints();
    const setMinimalShellMode = useSetMinimalShellMode();
    const convoId = route.params.conversation;
    const { setCurrentConvoId } = useCurrentConvoId();
    useEnableKeyboardControllerScreen(true);
    useFocusEffect(useCallback(() => {
        setCurrentConvoId(convoId);
        if (isWeb && !gtMobile) {
            setMinimalShellMode(true);
        }
        else {
            setMinimalShellMode(false);
        }
        return () => {
            setCurrentConvoId(undefined);
            setMinimalShellMode(false);
        };
    }, [gtMobile, convoId, setCurrentConvoId, setMinimalShellMode]));
    return (_jsx(Layout.Screen, { testID: "convoScreen", style: web([{ minHeight: 0 }, a.flex_1]), children: _jsx(ConvoProvider, { convoId: convoId, children: _jsx(Inner, {}) }, convoId) }));
}
function Inner() {
    const t = useTheme();
    const convoState = useConvo();
    const { _ } = useLingui();
    const moderationOpts = useModerationOpts();
    const { data: recipientUnshadowed } = useProfileQuery({
        did: convoState.recipients?.[0].did,
    });
    const recipient = useMaybeProfileShadow(recipientUnshadowed);
    const moderation = React.useMemo(() => {
        if (!recipient || !moderationOpts)
            return null;
        return moderateProfile(recipient, moderationOpts);
    }, [recipient, moderationOpts]);
    // Because we want to give the list a chance to asynchronously scroll to the end before it is visible to the user,
    // we use `hasScrolled` to determine when to render. With that said however, there is a chance that the chat will be
    // empty. So, we also check for that possible state as well and render once we can.
    const [hasScrolled, setHasScrolled] = React.useState(false);
    const readyToShow = hasScrolled ||
        (isConvoActive(convoState) &&
            !convoState.isFetchingHistory &&
            convoState.items.length === 0);
    // Any time that we re-render the `Initializing` state, we have to reset `hasScrolled` to false. After entering this
    // state, we know that we're resetting the list of messages and need to re-scroll to the bottom when they get added.
    React.useEffect(() => {
        if (convoState.status === ConvoStatus.Initializing) {
            setHasScrolled(false);
        }
    }, [convoState.status]);
    if (convoState.status === ConvoStatus.Error) {
        return (_jsxs(_Fragment, { children: [_jsx(Layout.Center, { style: [a.flex_1], children: moderation ? (_jsx(MessagesListHeader, { moderation: moderation, profile: recipient })) : (_jsx(MessagesListHeader, {})) }), _jsx(Error, { title: _(msg `Something went wrong`), message: _(msg `We couldn't load this conversation`), onRetry: () => convoState.error.retry(), sideBorders: false })] }));
    }
    return (_jsxs(Layout.Center, { style: [a.flex_1], children: [!readyToShow &&
                (moderation ? (_jsx(MessagesListHeader, { moderation: moderation, profile: recipient })) : (_jsx(MessagesListHeader, {}))), _jsxs(View, { style: [a.flex_1], children: [moderation && recipient ? (_jsx(InnerReady, { moderation: moderation, recipient: recipient, hasScrolled: hasScrolled, setHasScrolled: setHasScrolled })) : (_jsx(View, { style: [a.align_center, a.gap_sm, a.flex_1] })), !readyToShow && (_jsx(View, { style: [
                            a.absolute,
                            a.z_10,
                            a.w_full,
                            a.h_full,
                            a.justify_center,
                            a.align_center,
                            t.atoms.bg,
                        ], children: _jsx(View, { style: [{ marginBottom: 75 }], children: _jsx(Loader, { size: "xl" }) }) }))] })] }));
}
function InnerReady({ moderation, recipient, hasScrolled, setHasScrolled, }) {
    const convoState = useConvo();
    const navigation = useNavigation();
    const { params } = useRoute();
    const { needsEmailVerification } = useEmail();
    const emailDialogControl = useEmailDialogControl();
    /**
     * Must be non-reactive, otherwise the update to open the global dialog will
     * cause a re-render loop.
     */
    const maybeBlockForEmailVerification = useNonReactiveCallback(() => {
        if (needsEmailVerification) {
            /*
             * HACKFIX
             *
             * Load bearing timeout, to bump this state update until the after the
             * `navigator.addListener('state')` handler closes elements from
             * `shell/index.*.tsx`  - sfn & esb
             */
            setTimeout(() => emailDialogControl.open({
                id: EmailDialogScreenID.Verify,
                instructions: [
                    _jsx(Trans, { children: "Before you can message another user, you must first verify your email." }, "pre-compose"),
                ],
                onCloseWithoutVerifying: () => {
                    if (navigation.canGoBack()) {
                        navigation.goBack();
                    }
                    else {
                        navigation.navigate('Messages', { animation: 'pop' });
                    }
                },
            }));
        }
    });
    useEffect(() => {
        maybeBlockForEmailVerification();
    }, [maybeBlockForEmailVerification]);
    return (_jsxs(_Fragment, { children: [_jsx(MessagesListHeader, { profile: recipient, moderation: moderation }), isConvoActive(convoState) && (_jsx(MessagesList, { hasScrolled: hasScrolled, setHasScrolled: setHasScrolled, blocked: moderation?.blocked, hasAcceptOverride: !!params.accept, footer: _jsx(MessagesListBlockedFooter, { recipient: recipient, convoId: convoState.convo.id, hasMessages: convoState.items.length > 0, moderation: moderation }) }))] }));
}
//# sourceMappingURL=Conversation.js.map