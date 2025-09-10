declare enum ScreenState {
    S_LoginOrCreateAccount = 0,
    S_Login = 1,
    S_CreateAccount = 2,
    S_StarterPack = 3
}
export { ScreenState as LoggedOutScreenState };
export declare function LoggedOut({ onDismiss }: {
    onDismiss?: () => void;
}): any;
//# sourceMappingURL=LoggedOut.d.ts.map