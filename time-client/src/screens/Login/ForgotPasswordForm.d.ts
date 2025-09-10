import { type ComAtprotoServerDescribeServer } from '@atproto/api';
type ServiceDescription = ComAtprotoServerDescribeServer.OutputSchema;
export declare const ForgotPasswordForm: ({ error, serviceUrl, serviceDescription, setError, setServiceUrl, onPressBack, onEmailSent, }: {
    error: string;
    serviceUrl: string;
    serviceDescription: ServiceDescription | undefined;
    setError: (v: string) => void;
    setServiceUrl: (v: string) => void;
    onPressBack: () => void;
    onEmailSent: () => void;
}) => any;
export {};
//# sourceMappingURL=ForgotPasswordForm.d.ts.map