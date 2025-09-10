import React from 'react';
import { type ColorValue } from 'react-native';
interface GestureAction {
    color: ColorValue;
    action: () => void;
    threshold: number;
    icon: React.ElementType;
}
interface GestureActions {
    leftFirst?: GestureAction;
    leftSecond?: GestureAction;
    rightFirst?: GestureAction;
    rightSecond?: GestureAction;
}
export declare function GestureActionView({ children, actions, }: {
    children: React.ReactNode;
    actions: GestureActions;
}): any;
export {};
//# sourceMappingURL=GestureActionView.d.ts.map