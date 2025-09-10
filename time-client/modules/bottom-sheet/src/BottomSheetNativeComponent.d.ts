import * as React from 'react';
import { type BottomSheetViewProps } from './BottomSheet.types';
export declare class BottomSheetNativeComponent extends React.Component<BottomSheetViewProps, {
    open: boolean;
    viewHeight?: number;
}> {
    ref: any;
    static contextType: any;
    constructor(props: BottomSheetViewProps);
    present(): void;
    dismiss(): void;
    private onStateChange;
    private updateLayout;
    static dismissAll: () => Promise<void>;
    render(): any;
}
//# sourceMappingURL=BottomSheetNativeComponent.d.ts.map