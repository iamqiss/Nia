import { jsx as _jsx } from "react/jsx-runtime";
import React from 'react';
import { Modal, View } from 'react-native';
import { useDialogStateControlContext } from '#/state/dialogs';
import { useComposerState } from '#/state/shell/composer';
import { atoms as a, useTheme } from '#/alf';
import { ComposePost, useComposerCancelRef } from '../com/composer/Composer';
export function Composer({}) {
    const { setFullyExpandedCount } = useDialogStateControlContext();
    const t = useTheme();
    const state = useComposerState();
    const ref = useComposerCancelRef();
    const open = !!state;
    const prevOpen = React.useRef(open);
    React.useEffect(() => {
        if (open && !prevOpen.current) {
            setFullyExpandedCount(c => c + 1);
        }
        else if (!open && prevOpen.current) {
            setFullyExpandedCount(c => c - 1);
        }
        prevOpen.current = open;
    }, [open, setFullyExpandedCount]);
    return (_jsx(Modal, { "aria-modal": true, accessibilityViewIsModal: true, visible: open, presentationStyle: "pageSheet", animationType: "slide", onRequestClose: () => ref.current?.onPressCancel(), children: _jsx(View, { style: [t.atoms.bg, a.flex_1], children: _jsx(ComposePost, { cancelRef: ref, replyTo: state?.replyTo, onPost: state?.onPost, onPostSuccess: state?.onPostSuccess, quote: state?.quote, mention: state?.mention, text: state?.text, imageUris: state?.imageUris, videoUri: state?.videoUri }) }) }));
}
//# sourceMappingURL=Composer.ios.js.map