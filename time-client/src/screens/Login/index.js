import { jsx as _jsx } from "react/jsx-runtime";
import React, { useRef } from 'react';
import { KeyboardAvoidingView } from 'react-native';
import { LayoutAnimationConfig } from 'react-native-reanimated';
import { msg } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { DEFAULT_SERVICE } from '#/lib/constants';
import { logEvent } from '#/lib/statsig/statsig';
import { logger } from '#/logger';
import { useServiceQuery } from '#/state/queries/service';
import { useSession } from '#/state/session';
import { useLoggedOutView } from '#/state/shell/logged-out';
import { LoggedOutLayout } from '#/view/com/util/layouts/LoggedOutLayout';
import { ForgotPasswordForm } from '#/screens/Login/ForgotPasswordForm';
import { LoginForm } from '#/screens/Login/LoginForm';
import { PasswordUpdatedForm } from '#/screens/Login/PasswordUpdatedForm';
import { SetNewPasswordForm } from '#/screens/Login/SetNewPasswordForm';
import { atoms as a } from '#/alf';
import { ChooseAccountForm } from './ChooseAccountForm';
import { ScreenTransition } from './ScreenTransition';
var Forms;
(function (Forms) {
    Forms[Forms["Login"] = 0] = "Login";
    Forms[Forms["ChooseAccount"] = 1] = "ChooseAccount";
    Forms[Forms["ForgotPassword"] = 2] = "ForgotPassword";
    Forms[Forms["SetNewPassword"] = 3] = "SetNewPassword";
    Forms[Forms["PasswordUpdated"] = 4] = "PasswordUpdated";
})(Forms || (Forms = {}));
export const Login = ({ onPressBack }) => {
    const { _ } = useLingui();
    const failedAttemptCountRef = useRef(0);
    const startTimeRef = useRef(Date.now());
    const { accounts } = useSession();
    const { requestedAccountSwitchTo } = useLoggedOutView();
    const requestedAccount = accounts.find(acc => acc.did === requestedAccountSwitchTo);
    const [error, setError] = React.useState('');
    const [serviceUrl, setServiceUrl] = React.useState(requestedAccount?.service || DEFAULT_SERVICE);
    const [initialHandle, setInitialHandle] = React.useState(requestedAccount?.handle || '');
    const [currentForm, setCurrentForm] = React.useState(requestedAccount
        ? Forms.Login
        : accounts.length
            ? Forms.ChooseAccount
            : Forms.Login);
    const { data: serviceDescription, error: serviceError, refetch: refetchService, } = useServiceQuery(serviceUrl);
    const onSelectAccount = (account) => {
        if (account?.service) {
            setServiceUrl(account.service);
        }
        setInitialHandle(account?.handle || '');
        setCurrentForm(Forms.Login);
    };
    const gotoForm = (form) => {
        setError('');
        setCurrentForm(form);
    };
    React.useEffect(() => {
        if (serviceError) {
            setError(_(msg `Unable to contact your service. Please check your Internet connection.`));
            logger.warn(`Failed to fetch service description for ${serviceUrl}`, {
                error: String(serviceError),
            });
            logEvent('signin:hostingProviderFailedResolution', {});
        }
        else {
            setError('');
        }
    }, [serviceError, serviceUrl, _]);
    const onPressForgotPassword = () => {
        setCurrentForm(Forms.ForgotPassword);
        logEvent('signin:forgotPasswordPressed', {});
    };
    const handlePressBack = () => {
        onPressBack();
        logEvent('signin:backPressed', {
            failedAttemptsCount: failedAttemptCountRef.current,
        });
    };
    const onAttemptSuccess = () => {
        logEvent('signin:success', {
            isUsingCustomProvider: serviceUrl !== DEFAULT_SERVICE,
            timeTakenSeconds: Math.round((Date.now() - startTimeRef.current) / 1000),
            failedAttemptsCount: failedAttemptCountRef.current,
        });
        setCurrentForm(Forms.Login);
    };
    const onAttemptFailed = () => {
        failedAttemptCountRef.current += 1;
    };
    let content = null;
    let title = '';
    let description = '';
    switch (currentForm) {
        case Forms.Login:
            title = _(msg `Sign in`);
            description = _(msg `Enter your username and password`);
            content = (_jsx(LoginForm, { error: error, serviceUrl: serviceUrl, serviceDescription: serviceDescription, initialHandle: initialHandle, setError: setError, onAttemptFailed: onAttemptFailed, onAttemptSuccess: onAttemptSuccess, setServiceUrl: setServiceUrl, onPressBack: () => accounts.length ? gotoForm(Forms.ChooseAccount) : handlePressBack(), onPressForgotPassword: onPressForgotPassword, onPressRetryConnect: refetchService }));
            break;
        case Forms.ChooseAccount:
            title = _(msg `Sign in`);
            description = _(msg `Select from an existing account`);
            content = (_jsx(ChooseAccountForm, { onSelectAccount: onSelectAccount, onPressBack: handlePressBack }));
            break;
        case Forms.ForgotPassword:
            title = _(msg `Forgot Password`);
            description = _(msg `Let's get your password reset!`);
            content = (_jsx(ForgotPasswordForm, { error: error, serviceUrl: serviceUrl, serviceDescription: serviceDescription, setError: setError, setServiceUrl: setServiceUrl, onPressBack: () => gotoForm(Forms.Login), onEmailSent: () => gotoForm(Forms.SetNewPassword) }));
            break;
        case Forms.SetNewPassword:
            title = _(msg `Forgot Password`);
            description = _(msg `Let's get your password reset!`);
            content = (_jsx(SetNewPasswordForm, { error: error, serviceUrl: serviceUrl, setError: setError, onPressBack: () => gotoForm(Forms.ForgotPassword), onPasswordSet: () => gotoForm(Forms.PasswordUpdated) }));
            break;
        case Forms.PasswordUpdated:
            title = _(msg `Password updated`);
            description = _(msg `You can now sign in with your new password.`);
            content = (_jsx(PasswordUpdatedForm, { onPressNext: () => gotoForm(Forms.Login) }));
            break;
    }
    return (_jsx(KeyboardAvoidingView, { testID: "signIn", behavior: "padding", style: a.flex_1, children: _jsx(LoggedOutLayout, { leadin: "", title: title, description: description, scrollable: true, children: _jsx(LayoutAnimationConfig, { skipEntering: true, skipExiting: true, children: _jsx(ScreenTransition, { children: content }, currentForm) }) }) }));
};
//# sourceMappingURL=index.js.map