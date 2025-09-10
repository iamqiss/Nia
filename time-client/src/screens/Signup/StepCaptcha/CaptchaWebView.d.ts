import { type SignupState } from '#/screens/Signup/state';
export declare function CaptchaWebView({ url, stateParam, state, onSuccess, onError, }: {
    url: string;
    stateParam: string;
    state?: SignupState;
    onSuccess: (code: string) => void;
    onError: (error: unknown) => void;
}): any;
//# sourceMappingURL=CaptchaWebView.d.ts.map