import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import 'react-image-crop/dist/ReactCrop.css';
import { useCallback, useImperativeHandle, useRef, useState } from 'react';
import { View } from 'react-native';
import { msg, Trans } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import ReactCrop, {} from 'react-image-crop';
import { manipulateImage, } from '#/state/gallery';
import { atoms as a, useTheme } from '#/alf';
import { Button, ButtonIcon, ButtonText } from '#/components/Button';
import * as Dialog from '#/components/Dialog';
import { Loader } from '#/components/Loader';
import {} from './EditImageDialog';
export function EditImageDialog(props) {
    return (_jsxs(Dialog.Outer, { control: props.control, children: [_jsx(Dialog.Handle, {}), _jsx(DialogInner, { ...props })] }));
}
function DialogInner({ control, image, onChange, circularCrop, aspectRatio, }) {
    const { _ } = useLingui();
    const [pending, setPending] = useState(false);
    const ref = useRef(null);
    const cancelButton = useCallback(() => (_jsx(Button, { label: _(msg `Cancel`), disabled: pending, onPress: () => control.close(), size: "small", color: "primary", variant: "ghost", style: [a.rounded_full], testID: "cropImageCancelBtn", children: _jsx(ButtonText, { style: [a.text_md], children: _jsx(Trans, { children: "Cancel" }) }) })), [control, _, pending]);
    const saveButton = useCallback(() => (_jsxs(Button, { label: _(msg `Save`), onPress: async () => {
            setPending(true);
            await ref.current?.save();
            setPending(false);
        }, disabled: pending, size: "small", color: "primary", variant: "ghost", style: [a.rounded_full], testID: "cropImageSaveBtn", children: [_jsx(ButtonText, { style: [a.text_md], children: _jsx(Trans, { children: "Save" }) }), pending && _jsx(ButtonIcon, { icon: Loader })] })), [_, pending]);
    return (_jsx(Dialog.Inner, { label: _(msg `Edit image`), header: _jsx(Dialog.Header, { renderLeft: cancelButton, renderRight: saveButton, children: _jsx(Dialog.HeaderText, { children: _jsx(Trans, { children: "Edit image" }) }) }), children: image && (_jsx(EditImageInner, { saveRef: ref, image: image, onChange: onChange, circularCrop: circularCrop, aspectRatio: aspectRatio }, image.source.id)) }));
}
function EditImageInner({ image, onChange, saveRef, circularCrop = false, aspectRatio, }) {
    const t = useTheme();
    const [isDragging, setIsDragging] = useState(false);
    const { _ } = useLingui();
    const control = Dialog.useDialogContext();
    const source = image.source;
    const initialCrop = getInitialCrop(source, image.manips);
    const [crop, setCrop] = useState(initialCrop);
    const onPressSubmit = useCallback(async () => {
        const result = await manipulateImage(image, {
            crop: crop && (crop.width || crop.height) !== 0
                ? {
                    originX: (crop.x * source.width) / 100,
                    originY: (crop.y * source.height) / 100,
                    width: (crop.width * source.width) / 100,
                    height: (crop.height * source.height) / 100,
                }
                : undefined,
        });
        control.close(() => {
            onChange(result);
        });
    }, [crop, image, source, control, onChange]);
    useImperativeHandle(saveRef, () => ({
        save: onPressSubmit,
    }), [onPressSubmit]);
    return (_jsxs(View, { style: [
            a.mx_auto,
            a.border,
            t.atoms.border_contrast_low,
            a.rounded_xs,
            a.overflow_hidden,
            a.align_center,
        ], children: [_jsx(ReactCrop, { crop: crop, aspect: aspectRatio, circularCrop: circularCrop, onChange: (_pixelCrop, percentCrop) => setCrop(percentCrop), className: "ReactCrop--no-animate", onDragStart: () => setIsDragging(true), onDragEnd: () => setIsDragging(false), children: _jsx("img", { src: source.path, style: { maxHeight: `50vh` } }) }), isDragging && _jsx(View, { style: [a.fixed, a.inset_0] })] }));
}
const getInitialCrop = (source, manips) => {
    const initialArea = manips?.crop;
    if (initialArea) {
        return {
            unit: '%',
            x: (initialArea.originX / source.width) * 100,
            y: (initialArea.originY / source.height) * 100,
            width: (initialArea.width / source.width) * 100,
            height: (initialArea.height / source.height) * 100,
        };
    }
};
//# sourceMappingURL=EditImageDialog.web.js.map