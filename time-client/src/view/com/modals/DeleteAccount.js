import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import React from 'react';
import { ActivityIndicator, SafeAreaView, StyleSheet, TouchableOpacity, View, } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { msg, Trans } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { DM_SERVICE_HEADERS } from '#/lib/constants';
import { usePalette } from '#/lib/hooks/usePalette';
import { useWebMediaQueries } from '#/lib/hooks/useWebMediaQueries';
import { cleanError } from '#/lib/strings/errors';
import { colors, gradients, s } from '#/lib/styles';
import { useTheme } from '#/lib/ThemeContext';
import { isAndroid, isWeb } from '#/platform/detection';
import { useModalControls } from '#/state/modals';
import { useAgent, useSession, useSessionApi } from '#/state/session';
import { atoms as a, useTheme as useNewTheme } from '#/alf';
import { CircleInfo_Stroke2_Corner0_Rounded as CircleInfo } from '#/components/icons/CircleInfo';
import { Text as NewText } from '#/components/Typography';
import { resetToTab } from '../../../Navigation';
import { ErrorMessage } from '../util/error/ErrorMessage';
import { Text } from '../util/text/Text';
import * as Toast from '../util/Toast';
import { ScrollView, TextInput } from './util';
export const snapPoints = isAndroid ? ['90%'] : ['55%'];
export function Component({}) {
    const pal = usePalette('default');
    const theme = useTheme();
    const t = useNewTheme();
    const { currentAccount } = useSession();
    const agent = useAgent();
    const { removeAccount } = useSessionApi();
    const { _ } = useLingui();
    const { closeModal } = useModalControls();
    const { isMobile } = useWebMediaQueries();
    const [isEmailSent, setIsEmailSent] = React.useState(false);
    const [confirmCode, setConfirmCode] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [isProcessing, setIsProcessing] = React.useState(false);
    const [error, setError] = React.useState('');
    const onPressSendEmail = async () => {
        setError('');
        setIsProcessing(true);
        try {
            await agent.com.atproto.server.requestAccountDelete();
            setIsEmailSent(true);
        }
        catch (e) {
            setError(cleanError(e));
        }
        setIsProcessing(false);
    };
    const onPressConfirmDelete = async () => {
        if (!currentAccount?.did) {
            throw new Error(`DeleteAccount modal: currentAccount.did is undefined`);
        }
        setError('');
        setIsProcessing(true);
        const token = confirmCode.replace(/\s/g, '');
        try {
            // inform chat service of intent to delete account
            const { success } = await agent.api.chat.bsky.actor.deleteAccount(undefined, {
                headers: DM_SERVICE_HEADERS,
            });
            if (!success) {
                throw new Error('Failed to inform chat service of account deletion');
            }
            await agent.com.atproto.server.deleteAccount({
                did: currentAccount.did,
                password,
                token,
            });
            Toast.show(_(msg `Your account has been deleted`));
            resetToTab('HomeTab');
            removeAccount(currentAccount);
            closeModal();
        }
        catch (e) {
            setError(cleanError(e));
        }
        setIsProcessing(false);
    };
    const onCancel = () => {
        closeModal();
    };
    return (_jsx(SafeAreaView, { style: [s.flex1], children: _jsxs(ScrollView, { style: [pal.view], keyboardShouldPersistTaps: "handled", children: [_jsx(View, { style: [styles.titleContainer, pal.view], children: _jsx(Text, { type: "title-xl", style: [s.textCenter, pal.text], children: _jsxs(Trans, { children: ["Delete Account", ' ', _jsx(Text, { type: "title-xl", style: [pal.text, s.bold], children: "\"" }), _jsx(Text, { type: "title-xl", numberOfLines: 1, style: [
                                        isMobile ? styles.titleMobile : styles.titleDesktop,
                                        pal.text,
                                        s.bold,
                                    ], children: currentAccount?.handle }), _jsx(Text, { type: "title-xl", style: [pal.text, s.bold], children: "\"" })] }) }) }), !isEmailSent ? (_jsxs(_Fragment, { children: [_jsx(Text, { type: "lg", style: [styles.description, pal.text], children: _jsx(Trans, { children: "For security reasons, we'll need to send a confirmation code to your email address." }) }), error ? (_jsx(View, { style: s.mt10, children: _jsx(ErrorMessage, { message: error }) })) : undefined, isProcessing ? (_jsx(View, { style: [styles.btn, s.mt10], children: _jsx(ActivityIndicator, {}) })) : (_jsxs(_Fragment, { children: [_jsx(TouchableOpacity, { style: styles.mt20, onPress: onPressSendEmail, accessibilityRole: "button", accessibilityLabel: _(msg `Send email`), accessibilityHint: _(msg `Sends email with confirmation code for account deletion`), children: _jsx(LinearGradient, { colors: [
                                            gradients.blueLight.start,
                                            gradients.blueLight.end,
                                        ], start: { x: 0, y: 0 }, end: { x: 1, y: 1 }, style: [styles.btn], children: _jsx(Text, { type: "button-lg", style: [s.white, s.bold], children: _jsx(Trans, { context: "action", children: "Send Email" }) }) }) }), _jsx(TouchableOpacity, { style: [styles.btn, s.mt10], onPress: onCancel, accessibilityRole: "button", accessibilityLabel: _(msg `Cancel account deletion`), accessibilityHint: "", onAccessibilityEscape: onCancel, children: _jsx(Text, { type: "button-lg", style: pal.textLight, children: _jsx(Trans, { context: "action", children: "Cancel" }) }) })] })), _jsx(View, { style: [!isWeb && a.px_xl], children: _jsxs(View, { style: [
                                    a.w_full,
                                    a.flex_row,
                                    a.gap_sm,
                                    a.mt_lg,
                                    a.p_lg,
                                    a.rounded_sm,
                                    t.atoms.bg_contrast_25,
                                ], children: [_jsx(CircleInfo, { size: "md", style: [
                                            a.relative,
                                            {
                                                top: -1,
                                            },
                                        ] }), _jsx(NewText, { style: [a.leading_snug, a.flex_1], children: _jsx(Trans, { children: "You can also temporarily deactivate your account instead, and reactivate it at any time." }) })] }) })] })) : (_jsxs(_Fragment, { children: [_jsx(Text, { type: "lg", style: [pal.text, styles.description], nativeID: "confirmationCode", children: _jsx(Trans, { children: "Check your inbox for an email with the confirmation code to enter below:" }) }), _jsx(TextInput, { style: [styles.textInput, pal.borderDark, pal.text, styles.mb20], placeholder: _(msg `Confirmation code`), placeholderTextColor: pal.textLight.color, keyboardAppearance: theme.colorScheme, value: confirmCode, onChangeText: setConfirmCode, accessibilityLabelledBy: "confirmationCode", accessibilityLabel: _(msg `Confirmation code`), accessibilityHint: _(msg `Input confirmation code for account deletion`) }), _jsx(Text, { type: "lg", style: [pal.text, styles.description], nativeID: "password", children: _jsx(Trans, { children: "Please enter your password as well:" }) }), _jsx(TextInput, { style: [styles.textInput, pal.borderDark, pal.text], placeholder: _(msg `Password`), placeholderTextColor: pal.textLight.color, keyboardAppearance: theme.colorScheme, secureTextEntry: true, value: password, onChangeText: setPassword, accessibilityLabelledBy: "password", accessibilityLabel: _(msg `Password`), accessibilityHint: _(msg `Input password for account deletion`) }), error ? (_jsx(View, { style: styles.mt20, children: _jsx(ErrorMessage, { message: error }) })) : undefined, isProcessing ? (_jsx(View, { style: [styles.btn, s.mt10], children: _jsx(ActivityIndicator, {}) })) : (_jsxs(_Fragment, { children: [_jsx(TouchableOpacity, { style: [styles.btn, styles.evilBtn, styles.mt20], onPress: onPressConfirmDelete, accessibilityRole: "button", accessibilityLabel: _(msg `Confirm delete account`), accessibilityHint: "", children: _jsx(Text, { type: "button-lg", style: [s.white, s.bold], children: _jsx(Trans, { children: "Delete my account" }) }) }), _jsx(TouchableOpacity, { style: [styles.btn, s.mt10], onPress: onCancel, accessibilityRole: "button", accessibilityLabel: _(msg `Cancel account deletion`), accessibilityHint: _(msg `Exits account deletion process`), onAccessibilityEscape: onCancel, children: _jsx(Text, { type: "button-lg", style: pal.textLight, children: _jsx(Trans, { context: "action", children: "Cancel" }) }) })] }))] }))] }) }));
}
const styles = StyleSheet.create({
    titleContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        flexWrap: 'wrap',
        marginTop: 12,
        marginBottom: 12,
        marginLeft: 20,
        marginRight: 20,
    },
    titleMobile: {
        textAlign: 'center',
    },
    titleDesktop: {
        textAlign: 'center',
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis',
        // @ts-ignore only rendered on web
        maxWidth: '400px',
    },
    description: {
        textAlign: 'center',
        paddingHorizontal: 22,
        marginBottom: 10,
    },
    mt20: {
        marginTop: 20,
    },
    mb20: {
        marginBottom: 20,
    },
    textInput: {
        borderWidth: 1,
        borderRadius: 6,
        paddingHorizontal: 16,
        paddingVertical: 12,
        fontSize: 20,
        marginHorizontal: 20,
    },
    btn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 32,
        padding: 14,
        marginHorizontal: 20,
    },
    evilBtn: {
        backgroundColor: colors.red4,
    },
});
//# sourceMappingURL=DeleteAccount.js.map