import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { StyleSheet, TouchableWithoutFeedback, View } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { RemoveScrollBar } from 'react-remove-scroll-bar';
import { usePalette } from '#/lib/hooks/usePalette';
import { useWebMediaQueries } from '#/lib/hooks/useWebMediaQueries';
import {} from '#/state/modals';
import { useModalControls, useModals } from '#/state/modals';
import * as CreateOrEditListModal from './CreateOrEditList';
import * as DeleteAccountModal from './DeleteAccount';
import * as InviteCodesModal from './InviteCodes';
import * as ContentLanguagesSettingsModal from './lang-settings/ContentLanguagesSettings';
import * as UserAddRemoveLists from './UserAddRemoveLists';
export function ModalsContainer() {
    const { isModalActive, activeModals } = useModals();
    if (!isModalActive) {
        return null;
    }
    return (_jsxs(_Fragment, { children: [_jsx(RemoveScrollBar, {}), activeModals.map((modal, i) => (_jsx(Modal, { modal: modal }, `modal-${i}`)))] }));
}
function Modal({ modal }) {
    const { isModalActive } = useModals();
    const { closeModal } = useModalControls();
    const pal = usePalette('default');
    const { isMobile } = useWebMediaQueries();
    if (!isModalActive) {
        return null;
    }
    const onPressMask = () => {
        closeModal();
    };
    const onInnerPress = () => {
        // TODO: can we use prevent default?
        // do nothing, we just want to stop it from bubbling
    };
    let element;
    if (modal.name === 'create-or-edit-list') {
        element = _jsx(CreateOrEditListModal.Component, { ...modal });
    }
    else if (modal.name === 'user-add-remove-lists') {
        element = _jsx(UserAddRemoveLists.Component, { ...modal });
    }
    else if (modal.name === 'delete-account') {
        element = _jsx(DeleteAccountModal.Component, {});
    }
    else if (modal.name === 'invite-codes') {
        element = _jsx(InviteCodesModal.Component, {});
    }
    else if (modal.name === 'content-languages-settings') {
        element = _jsx(ContentLanguagesSettingsModal.Component, {});
    }
    else {
        return null;
    }
    return (
    // eslint-disable-next-line react-native-a11y/has-valid-accessibility-descriptors
    _jsx(TouchableWithoutFeedback, { onPress: onPressMask, children: _jsx(Animated.View, { style: styles.mask, entering: FadeIn.duration(150), exiting: FadeOut, children: _jsx(TouchableWithoutFeedback, { onPress: onInnerPress, children: _jsx(View, { style: [
                        styles.container,
                        isMobile && styles.containerMobile,
                        pal.view,
                        pal.border,
                    ], children: element }) }) }) }));
}
const styles = StyleSheet.create({
    mask: {
        // @ts-ignore
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: '#000c',
        alignItems: 'center',
        justifyContent: 'center',
    },
    container: {
        width: 600,
        // @ts-ignore web only
        maxWidth: '100vw',
        // @ts-ignore web only
        maxHeight: '90vh',
        paddingVertical: 20,
        paddingHorizontal: 24,
        borderRadius: 8,
        borderWidth: 1,
    },
    containerMobile: {
        borderRadius: 0,
        paddingHorizontal: 0,
    },
});
//# sourceMappingURL=Modal.web.js.map