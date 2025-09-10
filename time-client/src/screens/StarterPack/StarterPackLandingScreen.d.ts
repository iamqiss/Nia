import { LoggedOutScreenState } from '#/view/com/auth/LoggedOut';
interface AppClipMessage {
    action: 'present' | 'store';
    keyToStoreAs?: string;
    jsonToStore?: string;
}
export declare function postAppClipMessage(message: AppClipMessage): void;
export declare function LandingScreen({ setScreenState, }: {
    setScreenState: (state: LoggedOutScreenState) => void;
}): any;
export declare function AppClipOverlay({ visible, setIsVisible, }: {
    visible: boolean;
    setIsVisible: (visible: boolean) => void;
}): any;
export {};
//# sourceMappingURL=StarterPackLandingScreen.d.ts.map