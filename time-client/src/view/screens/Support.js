import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { msg, Trans } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { useFocusEffect } from '@react-navigation/native';
import { HELP_DESK_URL } from '#/lib/constants';
import { usePalette } from '#/lib/hooks/usePalette';
import {} from '#/lib/routes/types';
import { s } from '#/lib/styles';
import { useSetMinimalShellMode } from '#/state/shell';
import { TextLink } from '#/view/com/util/Link';
import { Text } from '#/view/com/util/text/Text';
import { ViewHeader } from '#/view/com/util/ViewHeader';
import { CenteredView } from '#/view/com/util/Views';
import * as Layout from '#/components/Layout';
export const SupportScreen = (_props) => {
    const pal = usePalette('default');
    const setMinimalShellMode = useSetMinimalShellMode();
    const { _ } = useLingui();
    useFocusEffect(React.useCallback(() => {
        setMinimalShellMode(false);
    }, [setMinimalShellMode]));
    return (_jsxs(Layout.Screen, { children: [_jsx(ViewHeader, { title: _(msg `Support`) }), _jsxs(CenteredView, { children: [_jsx(Text, { type: "title-xl", style: [pal.text, s.p20, s.pb5], children: _jsx(Trans, { children: "Support" }) }), _jsx(Text, { style: [pal.text, s.p20], children: _jsxs(Trans, { children: ["The support form has been moved. If you need help, please", ' ', _jsx(TextLink, { href: HELP_DESK_URL, text: _(msg `click here`), style: pal.link }), ' ', "or visit ", HELP_DESK_URL, " to get in touch with us."] }) })] })] }));
};
//# sourceMappingURL=Support.js.map