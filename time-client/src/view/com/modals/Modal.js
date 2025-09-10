import { jsx as _jsx } from "react/jsx-runtime";
import { Fragment, useEffect, useRef } from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import BottomSheet from '@discord/bottom-sheet/src';
import { usePalette } from '#/lib/hooks/usePalette';
import { useModalControls, useModals } from '#/state/modals';
import { FullWindowOverlay } from '#/components/FullWindowOverlay';
import { createCustomBackdrop } from '../util/BottomSheetCustomBackdrop';
import * as CreateOrEditListModal from './CreateOrEditList';
import * as DeleteAccountModal from './DeleteAccount';
import * as InviteCodesModal from './InviteCodes';
import * as ContentLanguagesSettingsModal from './lang-settings/ContentLanguagesSettings';
import * as UserAddRemoveListsModal from './UserAddRemoveLists';
const DEFAULT_SNAPPOINTS = ['90%'];
const HANDLE_HEIGHT = 24;
export function ModalsContainer() {
    const { isModalActive, activeModals } = useModals();
    const { closeModal } = useModalControls();
    const bottomSheetRef = useRef(null);
    const pal = usePalette('default');
    const activeModal = activeModals[activeModals.length - 1];
    const onBottomSheetChange = async (snapPoint) => {
        if (snapPoint === -1) {
            closeModal();
        }
    };
    const onClose = () => {
        bottomSheetRef.current?.close();
        closeModal();
    };
    useEffect(() => {
        if (isModalActive) {
            bottomSheetRef.current?.snapToIndex(0);
        }
        else {
            bottomSheetRef.current?.close();
        }
    }, [isModalActive, bottomSheetRef, activeModal?.name]);
    let snapPoints = DEFAULT_SNAPPOINTS;
    let element;
    if (activeModal?.name === 'create-or-edit-list') {
        snapPoints = CreateOrEditListModal.snapPoints;
        element = _jsx(CreateOrEditListModal.Component, { ...activeModal });
    }
    else if (activeModal?.name === 'user-add-remove-lists') {
        snapPoints = UserAddRemoveListsModal.snapPoints;
        element = _jsx(UserAddRemoveListsModal.Component, { ...activeModal });
    }
    else if (activeModal?.name === 'delete-account') {
        snapPoints = DeleteAccountModal.snapPoints;
        element = _jsx(DeleteAccountModal.Component, {});
    }
    else if (activeModal?.name === 'invite-codes') {
        snapPoints = InviteCodesModal.snapPoints;
        element = _jsx(InviteCodesModal.Component, {});
    }
    else if (activeModal?.name === 'content-languages-settings') {
        snapPoints = ContentLanguagesSettingsModal.snapPoints;
        element = _jsx(ContentLanguagesSettingsModal.Component, {});
    }
    else {
        return null;
    }
    if (snapPoints[0] === 'fullscreen') {
        return (_jsx(SafeAreaView, { style: [styles.fullscreenContainer, pal.view], children: element }));
    }
    const Container = activeModal ? FullWindowOverlay : Fragment;
    return (_jsx(Container, { children: _jsx(BottomSheet, { ref: bottomSheetRef, snapPoints: snapPoints, handleHeight: HANDLE_HEIGHT, index: isModalActive ? 0 : -1, enablePanDownToClose: true, android_keyboardInputMode: "adjustResize", keyboardBlurBehavior: "restore", backdropComponent: isModalActive ? createCustomBackdrop(onClose) : undefined, handleIndicatorStyle: { backgroundColor: pal.text.color }, handleStyle: [styles.handle, pal.view], backgroundStyle: pal.view, onChange: onBottomSheetChange, children: element }) }));
}
const styles = StyleSheet.create({
    handle: {
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
    },
    fullscreenContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
    },
});
//# sourceMappingURL=Modal.js.map