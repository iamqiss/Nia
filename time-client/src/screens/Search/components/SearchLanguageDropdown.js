import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useMemo } from 'react';
import { msg, Trans } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { languageName } from '#/locale/helpers';
import { APP_LANGUAGES, LANGUAGES } from '#/locale/languages';
import { useLanguagePrefs } from '#/state/preferences';
import { atoms as a, native, platform, tokens } from '#/alf';
import { Button, ButtonIcon, ButtonText } from '#/components/Button';
import { ChevronBottom_Stroke2_Corner0_Rounded as ChevronDownIcon, ChevronTopBottom_Stroke2_Corner0_Rounded as ChevronUpDownIcon, } from '#/components/icons/Chevron';
import { Earth_Stroke2_Corner0_Rounded as EarthIcon } from '#/components/icons/Globe';
import * as Menu from '#/components/Menu';
export function SearchLanguageDropdown({ value, onChange, }) {
    const { _ } = useLingui();
    const { appLanguage, contentLanguages } = useLanguagePrefs();
    const languages = useMemo(() => {
        return LANGUAGES.filter((lang, index, self) => Boolean(lang.code2) && // reduce to the code2 varieties
            index === self.findIndex(t => t.code2 === lang.code2))
            .map(l => ({
            label: languageName(l, appLanguage),
            value: l.code2,
            key: l.code2 + l.code3,
        }))
            .sort((a, b) => {
            // prioritize user's languages
            const aIsUser = contentLanguages.includes(a.value);
            const bIsUser = contentLanguages.includes(b.value);
            if (aIsUser && !bIsUser)
                return -1;
            if (bIsUser && !aIsUser)
                return 1;
            // prioritize "common" langs in the network
            const aIsCommon = !!APP_LANGUAGES.find(al => 
            // skip `ast`, because it uses a 3-letter code which conflicts with `as`
            // it begins with `a` anyway so still is top of the list
            al.code2 !== 'ast' && al.code2.startsWith(a.value));
            const bIsCommon = !!APP_LANGUAGES.find(al => 
            // ditto
            al.code2 !== 'ast' && al.code2.startsWith(b.value));
            if (aIsCommon && !bIsCommon)
                return -1;
            if (bIsCommon && !aIsCommon)
                return 1;
            // fall back to alphabetical
            return a.label.localeCompare(b.label);
        });
    }, [appLanguage, contentLanguages]);
    const currentLanguageLabel = languages.find(lang => lang.value === value)?.label ?? _(msg `All languages`);
    return (_jsxs(Menu.Root, { children: [_jsx(Menu.Trigger, { label: _(msg `Filter search by language (currently: ${currentLanguageLabel})`), children: ({ props }) => (_jsxs(Button, { ...props, label: props.accessibilityLabel, size: "small", color: platform({ native: 'primary', default: 'secondary' }), variant: platform({ native: 'ghost', default: 'solid' }), style: native([
                        a.py_sm,
                        a.px_sm,
                        { marginRight: tokens.space.sm * -1 },
                    ]), children: [_jsx(ButtonIcon, { icon: EarthIcon }), _jsx(ButtonText, { children: currentLanguageLabel }), _jsx(ButtonIcon, { icon: platform({
                                native: ChevronUpDownIcon,
                                default: ChevronDownIcon,
                            }) })] })) }), _jsxs(Menu.Outer, { children: [_jsx(Menu.LabelText, { children: _jsx(Trans, { children: "Filter search by language" }) }), _jsxs(Menu.Item, { label: _(msg `All languages`), onPress: () => onChange(''), children: [_jsx(Menu.ItemText, { children: _jsx(Trans, { children: "All languages" }) }), _jsx(Menu.ItemRadio, { selected: value === '' })] }), _jsx(Menu.Divider, {}), _jsx(Menu.Group, { children: languages.map(lang => (_jsxs(Menu.Item, { label: lang.label, onPress: () => onChange(lang.value), children: [_jsx(Menu.ItemText, { children: lang.label }), _jsx(Menu.ItemRadio, { selected: value === lang.value })] }, lang.key))) })] })] }));
}
//# sourceMappingURL=SearchLanguageDropdown.js.map