import { type ComAtprotoServerDescribeServer } from '@atproto/api';
type ServiceDescription = ComAtprotoServerDescribeServer.OutputSchema;
export declare const LoginForm: ({ error, serviceUrl, serviceDescription, initialHandle, setError, setServiceUrl, onPressRetryConnect, onPressBack, onPressForgotPassword, onAttemptSuccess, onAttemptFailed, }: {
    error: string;
    serviceUrl: string;
    serviceDescription: ServiceDescription | undefined;
    initialHandle: string;
    setError: (v: string) => void;
    setServiceUrl: (v: string) => void;
    onPressRetryConnect: () => void;
    onPressBack: () => void;
    onPressForgotPassword: () => void;
    onAttemptSuccess: () => void;
    onAttemptFailed: () => void;
}) => any;
export {};
//# sourceMappingURL=LoginForm.d.ts.map