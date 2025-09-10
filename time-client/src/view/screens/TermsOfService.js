import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { View } from 'react-native';
import { msg, Trans } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { useFocusEffect } from '@react-navigation/native';
import { usePalette } from '#/lib/hooks/usePalette';
import {} from '#/lib/routes/types';
import { s } from '#/lib/styles';
import { useSetMinimalShellMode } from '#/state/shell';
import { TextLink } from '#/view/com/util/Link';
import { Text } from '#/view/com/util/text/Text';
import { ScrollView } from '#/view/com/util/Views';
import * as Layout from '#/components/Layout';
import { ViewHeader } from '../com/util/ViewHeader';
export const TermsOfServiceScreen = (_props) => {
    const pal = usePalette('default');
    const setMinimalShellMode = useSetMinimalShellMode();
    const { _ } = useLingui();
    useFocusEffect(React.useCallback(() => {
        setMinimalShellMode(false);
    }, [setMinimalShellMode]));
    return (_jsxs(Layout.Screen, { children: [_jsx(ViewHeader, { title: _(msg `Terms of Service`) }), _jsxs(ScrollView, { style: [s.hContentRegion, pal.view], children: [_jsx(View, { style: [s.p20], children: _jsxs(Text, { style: pal.text, children: [_jsx(Trans, { children: "The Terms of Service have been moved to" }), ' ', _jsx(TextLink, { style: pal.link, href: "https://bsky.social/about/support/tos", text: "bsky.social/about/support/tos" })] }) }), _jsx(View, { style: s.footerSpacer })] })] }));
};
//# sourceMappingURL=TermsOfService.js.map