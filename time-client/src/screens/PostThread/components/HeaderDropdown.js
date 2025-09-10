import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { msg, Trans } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { HITSLOP_10 } from '#/lib/constants';
import { logger } from '#/logger';
import {} from '#/state/queries/preferences/useThreadPreferences';
import { Button, ButtonIcon } from '#/components/Button';
import { SettingsSliderVertical_Stroke2_Corner0_Rounded as SettingsSlider } from '#/components/icons/SettingsSlider';
import * as Menu from '#/components/Menu';
export function HeaderDropdown({ sort, view, setSort, setView, }) {
    const { _ } = useLingui();
    return (_jsxs(Menu.Root, { children: [_jsx(Menu.Trigger, { label: _(msg `Thread options`), children: ({ props: { onPress, ...props } }) => (_jsx(Button, { label: _(msg `Thread options`), size: "small", variant: "ghost", color: "secondary", shape: "round", hitSlop: HITSLOP_10, onPress: () => {
                        logger.metric('thread:click:headerMenuOpen', {});
                        onPress();
                    }, ...props, children: _jsx(ButtonIcon, { icon: SettingsSlider, size: "md" }) })) }), _jsxs(Menu.Outer, { children: [_jsx(Menu.LabelText, { children: _jsx(Trans, { children: "Show replies as" }) }), _jsxs(Menu.Group, { children: [_jsxs(Menu.Item, { label: _(msg `Linear`), onPress: () => {
                                    setView('linear');
                                }, children: [_jsx(Menu.ItemText, { children: _jsx(Trans, { children: "Linear" }) }), _jsx(Menu.ItemRadio, { selected: view === 'linear' })] }), _jsxs(Menu.Item, { label: _(msg `Threaded`), onPress: () => {
                                    setView('tree');
                                }, children: [_jsx(Menu.ItemText, { children: _jsx(Trans, { children: "Threaded" }) }), _jsx(Menu.ItemRadio, { selected: view === 'tree' })] })] }), _jsx(Menu.Divider, {}), _jsx(Menu.LabelText, { children: _jsx(Trans, { children: "Reply sorting" }) }), _jsxs(Menu.Group, { children: [_jsxs(Menu.Item, { label: _(msg `Top replies first`), onPress: () => {
                                    setSort('top');
                                }, children: [_jsx(Menu.ItemText, { children: _jsx(Trans, { children: "Top replies first" }) }), _jsx(Menu.ItemRadio, { selected: sort === 'top' })] }), _jsxs(Menu.Item, { label: _(msg `Oldest replies first`), onPress: () => {
                                    setSort('oldest');
                                }, children: [_jsx(Menu.ItemText, { children: _jsx(Trans, { children: "Oldest replies first" }) }), _jsx(Menu.ItemRadio, { selected: sort === 'oldest' })] }), _jsxs(Menu.Item, { label: _(msg `Newest replies first`), onPress: () => {
                                    setSort('newest');
                                }, children: [_jsx(Menu.ItemText, { children: _jsx(Trans, { children: "Newest replies first" }) }), _jsx(Menu.ItemRadio, { selected: sort === 'newest' })] })] })] })] }));
}
//# sourceMappingURL=HeaderDropdown.js.map