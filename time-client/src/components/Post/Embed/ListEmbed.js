import { jsx as _jsx } from "react/jsx-runtime";
import { useMemo } from 'react';
import { moderateUserList } from '@atproto/api';
import { useModerationOpts } from '#/state/preferences/moderation-opts';
import { atoms as a, useTheme } from '#/alf';
import * as ListCard from '#/components/ListCard';
import { ContentHider } from '#/components/moderation/ContentHider';
import {} from '#/types/bsky/post';
import {} from './types';
export function ListEmbed({ embed, }) {
    const t = useTheme();
    return (_jsx(ListCard.Default, { view: embed.view, style: [a.border, t.atoms.border_contrast_medium, a.p_md, a.rounded_sm] }));
}
export function ModeratedListEmbed({ embed, }) {
    const moderationOpts = useModerationOpts();
    const moderation = useMemo(() => {
        return moderationOpts
            ? moderateUserList(embed.view, moderationOpts)
            : undefined;
    }, [embed.view, moderationOpts]);
    return (_jsx(ContentHider, { modui: moderation?.ui('contentList'), childContainerStyle: [a.pt_xs], children: _jsx(ListEmbed, { embed: embed }) }));
}
//# sourceMappingURL=ListEmbed.js.map