import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { msg } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { sanitizeAppLanguageSetting } from '#/locale/helpers';
import { APP_LANGUAGES } from '#/locale/languages';
import * as Select from '#/components/Select';
export function LanguageSelect({ value, onChange, items = APP_LANGUAGES.map(l => ({
    label: l.name,
    value: l.code2,
})), }) {
    const { _ } = useLingui();
    const handleOnChange = React.useCallback((value) => {
        if (!value)
            return;
        onChange(sanitizeAppLanguageSetting(value));
    }, [onChange]);
    return (_jsxs(Select.Root, { value: value ? sanitizeAppLanguageSetting(value) : undefined, onValueChange: handleOnChange, children: [_jsxs(Select.Trigger, { label: _(msg `Select language`), children: [_jsx(Select.ValueText, { placeholder: _(msg `Select language`) }), _jsx(Select.Icon, {})] }), _jsx(Select.Content, { renderItem: ({ label, value }) => (_jsxs(Select.Item, { value: value, label: label, children: [_jsx(Select.ItemIndicator, {}), _jsx(Select.ItemText, { children: label })] })), items: items })] }));
}
//# sourceMappingURL=LanguageSelect.js.map