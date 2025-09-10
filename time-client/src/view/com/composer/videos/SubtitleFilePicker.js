import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useRef } from 'react';
import { View } from 'react-native';
import { msg, Trans } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { logger } from '#/logger';
import * as Toast from '#/view/com/util/Toast';
import { atoms as a } from '#/alf';
import { Button, ButtonIcon, ButtonText } from '#/components/Button';
import { CC_Stroke2_Corner0_Rounded as CCIcon } from '#/components/icons/CC';
export function SubtitleFilePicker({ onSelectFile, disabled, }) {
    const { _ } = useLingui();
    const ref = useRef(null);
    const handleClick = () => {
        ref.current?.click();
    };
    const handlePick = (evt) => {
        const selectedFile = evt.target.files?.[0];
        if (selectedFile) {
            if (selectedFile.type === 'text/vtt' ||
                // HACK: sometimes the mime type is just straight-up missing
                // best we can do is check the file extension and hope for the best
                selectedFile.name.endsWith('.vtt')) {
                onSelectFile(selectedFile);
            }
            else {
                logger.error('Invalid subtitle file type', {
                    safeMessage: `File: ${selectedFile.name} (${selectedFile.type})`,
                });
                Toast.show(_(msg `Only WebVTT (.vtt) files are supported`));
            }
        }
    };
    return (_jsxs(View, { style: a.gap_lg, children: [_jsx("input", { type: "file", accept: ".vtt", ref: ref, style: a.hidden, onChange: handlePick, disabled: disabled, "aria-disabled": disabled }), _jsx(View, { style: a.flex_row, children: _jsxs(Button, { onPress: handleClick, label: _(msg `Select subtitle file (.vtt)`), size: "large", color: "primary", variant: "solid", disabled: disabled, children: [_jsx(ButtonIcon, { icon: CCIcon }), _jsx(ButtonText, { children: _jsx(Trans, { children: "Select subtitle file (.vtt)" }) })] }) })] }));
}
//# sourceMappingURL=SubtitleFilePicker.js.map