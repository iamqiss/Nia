import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { View } from 'react-native';
import { msg, Trans } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { cleanError } from '#/lib/strings/errors';
import { getAge, getDateAgo } from '#/lib/strings/time';
import { logger } from '#/logger';
import { isIOS, isWeb } from '#/platform/detection';
import { usePreferencesQuery, usePreferencesSetBirthDateMutation, } from '#/state/queries/preferences';
import { ErrorMessage } from '#/view/com/util/error/ErrorMessage';
import { atoms as a, useTheme, web } from '#/alf';
import { Admonition } from '#/components/Admonition';
import { Button, ButtonIcon, ButtonText } from '#/components/Button';
import * as Dialog from '#/components/Dialog';
import { DateField } from '#/components/forms/DateField';
import { InlineLinkText } from '#/components/Link';
import { Loader } from '#/components/Loader';
import { Text } from '#/components/Typography';
export function BirthDateSettingsDialog({ control, }) {
    const t = useTheme();
    const { _ } = useLingui();
    const { isLoading, error, data: preferences } = usePreferencesQuery();
    return (_jsxs(Dialog.Outer, { control: control, nativeOptions: { preventExpansion: true }, children: [_jsx(Dialog.Handle, {}), _jsxs(Dialog.ScrollableInner, { label: _(msg `My Birthday`), style: web({ maxWidth: 400 }), children: [_jsxs(View, { style: [a.gap_sm], children: [_jsx(Text, { style: [a.text_xl, a.font_bold], children: _jsx(Trans, { children: "My Birthday" }) }), _jsx(Text, { style: [a.leading_snug, t.atoms.text_contrast_medium], children: _jsx(Trans, { children: "This information is private and not shared with other users." }) }), isLoading ? (_jsx(Loader, { size: "xl" })) : error || !preferences ? (_jsx(ErrorMessage, { message: error?.toString() ||
                                    _(msg `We were unable to load your birth date preferences. Please try again.`), style: [a.rounded_sm] })) : (_jsx(BirthdayInner, { control: control, preferences: preferences }))] }), _jsx(Dialog.Close, {})] })] }));
}
function BirthdayInner({ control, preferences, }) {
    const { _ } = useLingui();
    const [date, setDate] = React.useState(preferences.birthDate || getDateAgo(18));
    const { isPending, isError, error, mutateAsync: setBirthDate, } = usePreferencesSetBirthDateMutation();
    const hasChanged = date !== preferences.birthDate;
    const age = getAge(new Date(date));
    const isUnder13 = age < 13;
    const isUnder18 = age >= 13 && age < 18;
    const onSave = React.useCallback(async () => {
        try {
            // skip if date is the same
            if (hasChanged) {
                await setBirthDate({ birthDate: date });
            }
            control.close();
        }
        catch (e) {
            logger.error(`setBirthDate failed`, { message: e.message });
        }
    }, [date, setBirthDate, control, hasChanged]);
    return (_jsxs(View, { style: a.gap_lg, testID: "birthDateSettingsDialog", children: [_jsx(View, { style: isIOS && [a.w_full, a.align_center], children: _jsx(DateField, { testID: "birthdayInput", value: date, onChangeDate: newDate => setDate(new Date(newDate)), label: _(msg `Birthday`), accessibilityHint: _(msg `Enter your birth date`) }) }), isUnder18 && hasChanged && (_jsx(Admonition, { type: "info", children: _jsx(Trans, { children: "The birthdate you've entered means you are under 18 years old. Certain content and features may be unavailable to you." }) })), isUnder13 && (_jsx(Admonition, { type: "error", children: _jsxs(Trans, { children: ["You must be at least 13 years old to use Bluesky. Read our", ' ', _jsx(InlineLinkText, { to: "https://bsky.social/about/support/tos", label: _(msg `Terms of Service`), children: "Terms of Service" }), ' ', "for more information."] }) })), isError ? (_jsx(ErrorMessage, { message: cleanError(error), style: [a.rounded_sm] })) : undefined, _jsx(View, { style: isWeb && [a.flex_row, a.justify_end], children: _jsxs(Button, { label: hasChanged ? _(msg `Save birthday`) : _(msg `Done`), size: "large", onPress: onSave, variant: "solid", color: "primary", disabled: isUnder13, children: [_jsx(ButtonText, { children: hasChanged ? _jsx(Trans, { children: "Save" }) : _jsx(Trans, { children: "Done" }) }), isPending && _jsx(ButtonIcon, { icon: Loader })] }) })] }));
}
//# sourceMappingURL=BirthDateSettings.js.map