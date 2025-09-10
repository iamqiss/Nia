import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { View } from 'react-native';
import {} from '@atproto/api';
import { msg } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { listUriToHref } from '#/lib/strings/url-helpers';
import { atoms as a, useTheme } from '#/alf';
import * as Dialog from '#/components/Dialog';
import {} from '#/components/Dialog';
import { InlineLinkText } from '#/components/Link';
import * as Prompt from '#/components/Prompt';
import { Text } from '#/components/Typography';
export function BlockedByListDialog({ control, listBlocks, }) {
    const { _ } = useLingui();
    const t = useTheme();
    return (_jsxs(Prompt.Outer, { control: control, testID: "blockedByListDialog", children: [_jsx(Prompt.TitleText, { children: _(msg `User blocked by list`) }), _jsxs(View, { style: [a.gap_sm, a.pb_lg], children: [_jsxs(Text, { selectable: true, style: [a.text_md, a.leading_snug, t.atoms.text_contrast_high], children: [_(msg `This account is blocked by one or more of your moderation lists. To unblock, please visit the lists directly and remove this user.`), ' '] }), _jsxs(Text, { style: [a.text_md, a.leading_snug, t.atoms.text_contrast_high], children: [_(msg `Lists blocking this user:`), ' ', listBlocks.map((block, i) => block.source.type === 'list' ? (_jsxs(React.Fragment, { children: [i === 0 ? null : ', ', _jsx(InlineLinkText, { label: block.source.list.name, to: listUriToHref(block.source.list.uri), style: [a.text_md, a.leading_snug], children: block.source.list.name })] }, block.source.list.uri)) : null)] })] }), _jsx(Prompt.Actions, { children: _jsx(Prompt.Action, { cta: _(msg `I understand`), onPress: () => { } }) }), _jsx(Dialog.Close, {})] }));
}
//# sourceMappingURL=BlockedByListDialog.js.map