import { type ComAtprotoServerDescribeServer } from '@atproto/api';
export type ServiceDescription = ComAtprotoServerDescribeServer.OutputSchema;
export declare enum SignupStep {
    INFO = 0,
    HANDLE = 1,
    CAPTCHA = 2
}
type SubmitTask = {
    verificationCode: string | undefined;
    mutableProcessed: boolean;
};
type ErrorField = 'invite-code' | 'email' | 'handle' | 'password' | 'date-of-birth';
export type SignupState = {
    hasPrev: boolean;
    activeStep: SignupStep;
    serviceUrl: string;
    serviceDescription?: ServiceDescription;
    userDomain: string;
    dateOfBirth: Date;
    email: string;
    password: string;
    inviteCode: string;
    handle: string;
    error: string;
    errorField?: ErrorField;
    isLoading: boolean;
    pendingSubmit: null | SubmitTask;
    signupStartTime: number;
    fieldErrors: Record<ErrorField, number>;
    backgroundCount: number;
};
export type SignupAction = {
    type: 'prev';
} | {
    type: 'next';
} | {
    type: 'finish';
} | {
    type: 'setStep';
    value: SignupStep;
} | {
    type: 'setServiceUrl';
    value: string;
} | {
    type: 'setServiceDescription';
    value: ServiceDescription | undefined;
} | {
    type: 'setEmail';
    value: string;
} | {
    type: 'setPassword';
    value: string;
} | {
    type: 'setDateOfBirth';
    value: Date;
} | {
    type: 'setInviteCode';
    value: string;
} | {
    type: 'setHandle';
    value: string;
} | {
    type: 'setError';
    value: string;
    field?: ErrorField;
} | {
    type: 'clearError';
} | {
    type: 'setIsLoading';
    value: boolean;
} | {
    type: 'submit';
    task: SubmitTask;
} | {
    type: 'incrementBackgroundCount';
};
export declare const initialState: SignupState;
export declare function is13(date: Date): boolean;
export declare function is18(date: Date): boolean;
export declare function reducer(s: SignupState, a: SignupAction): SignupState;
export declare const SignupContext: any;
export declare const useSignupContext: () => any;
export declare function useSubmitSignup(): any;
export {};
//# sourceMappingURL=state.d.ts.map