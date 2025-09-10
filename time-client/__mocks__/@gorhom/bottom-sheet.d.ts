import React, { type ReactNode } from 'react';
declare const BottomSheetModalProvider: (props: any) => any;
declare class BottomSheet extends React.Component<{
    onClose?: () => void;
    children?: ReactNode;
}> {
    snapToIndex(): void;
    snapToPosition(): void;
    expand(): void;
    collapse(): void;
    close(): void;
    forceClose(): void;
    render(): any;
}
declare const BottomSheetModal: (props: any) => any;
declare const BottomSheetBackdrop: (props: any) => any;
declare const BottomSheetHandle: (props: any) => any;
declare const BottomSheetFooter: (props: any) => any;
declare const BottomSheetScrollView: (props: any) => any;
declare const BottomSheetFlatList: (props: any) => any;
declare const BottomSheetTextInput: (props: any) => any;
declare const useBottomSheet: any;
declare const useBottomSheetModal: any;
declare const useBottomSheetSpringConfigs: any;
declare const useBottomSheetTimingConfigs: any;
declare const useBottomSheetInternal: any;
declare const useBottomSheetDynamicSnapPoints: any;
export { useBottomSheet };
export { useBottomSheetModal };
export { useBottomSheetSpringConfigs };
export { useBottomSheetTimingConfigs };
export { useBottomSheetInternal };
export { useBottomSheetDynamicSnapPoints };
export { BottomSheetBackdrop, BottomSheetFlatList, BottomSheetFooter, BottomSheetHandle, BottomSheetModal, BottomSheetModalProvider, BottomSheetScrollView, BottomSheetTextInput, };
export default BottomSheet;
//# sourceMappingURL=bottom-sheet.d.ts.map