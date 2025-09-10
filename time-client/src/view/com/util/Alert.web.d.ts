import { type AlertButton, type AlertStatic } from 'react-native';
declare class WebAlert implements Pick<AlertStatic, 'alert'> {
    alert(title: string, message?: string, buttons?: AlertButton[]): void;
}
export declare const Alert: WebAlert;
export {};
//# sourceMappingURL=Alert.web.d.ts.map