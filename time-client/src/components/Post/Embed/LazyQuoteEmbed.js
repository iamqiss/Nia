import { jsx as _jsx } from "react/jsx-runtime";
import { useMemo } from 'react';
import { View } from 'react-native';
import { createEmbedViewRecordFromPost } from '#/state/queries/postgate/util';
import { useResolveLinkQuery } from '#/state/queries/resolve-link';
import { atoms as a, useTheme } from '#/alf';
import { QuoteEmbed } from '#/components/Post/Embed';
export function LazyQuoteEmbed({ uri }) {
    const t = useTheme();
    const { data } = useResolveLinkQuery(uri);
    const view = useMemo(() => {
        if (!data || data.type !== 'record' || data.kind !== 'post')
            return;
        return createEmbedViewRecordFromPost(data.view);
    }, [data]);
    return view ? (_jsx(QuoteEmbed, { embed: {
            type: 'post',
            view,
        } })) : (_jsx(View, { style: [
            a.w_full,
            a.rounded_md,
            t.atoms.bg_contrast_25,
            {
                height: 68,
            },
        ] }));
}
//# sourceMappingURL=LazyQuoteEmbed.js.map