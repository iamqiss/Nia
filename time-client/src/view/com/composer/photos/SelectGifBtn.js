import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { useCallback, useRef } from 'react';
import { Keyboard } from 'react-native';
import { msg } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { logEvent } from '#/lib/statsig/statsig';
import {} from '#/state/queries/tenor';
import { atoms as a, useTheme } from '#/alf';
import { Button } from '#/components/Button';
import { GifSelectDialog } from '#/components/dialogs/GifSelect';
import { GifSquare_Stroke2_Corner0_Rounded as GifIcon } from '#/components/icons/Gif';
export function SelectGifBtn({ onClose, onSelectGif, disabled }) {
    const { _ } = useLingui();
    const ref = useRef(null);
    const t = useTheme();
    const onPressSelectGif = useCallback(async () => {
        logEvent('composer:gif:open', {});
        Keyboard.dismiss();
        ref.current?.open();
    }, []);
    return (_jsxs(_Fragment, { children: [_jsx(Button, { testID: "openGifBtn", onPress: onPressSelectGif, label: _(msg `Select GIF`), accessibilityHint: _(msg `Opens GIF select dialog`), style: a.p_sm, variant: "ghost", shape: "round", color: "primary", disabled: disabled, children: _jsx(GifIcon, { size: "lg", style: disabled && t.atoms.text_contrast_low }) }), _jsx(GifSelectDialog, { controlRef: ref, onClose: onClose, onSelectGif: onSelectGif })] }));
}
//# sourceMappingURL=SelectGifBtn.js.map