import { jsx as _jsx } from "react/jsx-runtime";
import React, {} from 'react';
import { FlatList, Modal, ScrollView, TextInput, View } from 'react-native';
const BottomSheetModalContext = React.createContext(null);
BottomSheetModalContext.displayName = 'BottomSheetModalContext';
const BottomSheetModalProvider = (props) => {
    return _jsx(BottomSheetModalContext.Provider, { ...props, value: {} });
};
class BottomSheet extends React.Component {
    snapToIndex() { }
    snapToPosition() { }
    expand() { }
    collapse() { }
    close() {
        this.props.onClose?.();
    }
    forceClose() { }
    render() {
        return _jsx(View, { children: this.props.children });
    }
}
const BottomSheetModal = (props) => _jsx(Modal, { ...props });
const BottomSheetBackdrop = (props) => _jsx(View, { ...props });
const BottomSheetHandle = (props) => _jsx(View, { ...props });
const BottomSheetFooter = (props) => _jsx(View, { ...props });
const BottomSheetScrollView = (props) => _jsx(ScrollView, { ...props });
const BottomSheetFlatList = (props) => _jsx(FlatList, { ...props });
const BottomSheetTextInput = (props) => _jsx(TextInput, { ...props });
const useBottomSheet = jest.fn();
const useBottomSheetModal = jest.fn();
const useBottomSheetSpringConfigs = jest.fn();
const useBottomSheetTimingConfigs = jest.fn();
const useBottomSheetInternal = jest.fn();
const useBottomSheetDynamicSnapPoints = jest.fn();
export { useBottomSheet };
export { useBottomSheetModal };
export { useBottomSheetSpringConfigs };
export { useBottomSheetTimingConfigs };
export { useBottomSheetInternal };
export { useBottomSheetDynamicSnapPoints };
export { BottomSheetBackdrop, BottomSheetFlatList, BottomSheetFooter, BottomSheetHandle, BottomSheetModal, BottomSheetModalProvider, BottomSheetScrollView, BottomSheetTextInput, };
export default BottomSheet;
//# sourceMappingURL=bottom-sheet.js.map