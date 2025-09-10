import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import {} from '@atproto/api';
import { useModerationCauseDescription, } from '#/lib/moderation/useModerationCauseDescription';
import { ModerationDetailsDialog, useModerationDetailsDialogControl, } from '#/components/moderation/ModerationDetailsDialog';
const Context = React.createContext({});
Context.displayName = 'HiderContext';
export const useHider = () => React.useContext(Context);
export function Outer({ modui, isContentVisibleInitialState, allowOverride, children, }) {
    const control = useModerationDetailsDialogControl();
    const blur = modui?.blurs[0];
    const [isContentVisible, setIsContentVisible] = React.useState(isContentVisibleInitialState || !blur);
    const info = useModerationCauseDescription(blur);
    const meta = {
        isNoPwi: Boolean(modui?.blurs.find(cause => cause.type === 'label' &&
            cause.labelDef.identifier === '!no-unauthenticated')),
        allowOverride: allowOverride ?? !modui?.noOverride,
    };
    const showInfoDialog = () => {
        control.open();
    };
    const onSetContentVisible = (show) => {
        if (!meta.allowOverride)
            return;
        setIsContentVisible(show);
    };
    const ctx = {
        isContentVisible,
        setIsContentVisible: onSetContentVisible,
        showInfoDialog,
        info,
        meta,
    };
    return (_jsxs(Context.Provider, { value: ctx, children: [children, _jsx(ModerationDetailsDialog, { control: control, modcause: blur })] }));
}
export function Content({ children }) {
    const ctx = useHider();
    return ctx.isContentVisible ? children : null;
}
export function Mask({ children }) {
    const ctx = useHider();
    return ctx.isContentVisible ? null : children;
}
//# sourceMappingURL=Hider.js.map