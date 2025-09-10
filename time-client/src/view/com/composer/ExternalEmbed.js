import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { View } from 'react-native';
import { cleanError } from '#/lib/strings/errors';
import { useResolveGifQuery, useResolveLinkQuery, } from '#/state/queries/resolve-link';
import {} from '#/state/queries/tenor';
import { ExternalEmbedRemoveBtn } from '#/view/com/composer/ExternalEmbedRemoveBtn';
import { atoms as a, useTheme } from '#/alf';
import { Loader } from '#/components/Loader';
import { ExternalEmbed } from '#/components/Post/Embed/ExternalEmbed';
import { ModeratedFeedEmbed } from '#/components/Post/Embed/FeedEmbed';
import { ModeratedListEmbed } from '#/components/Post/Embed/ListEmbed';
import { Embed as StarterPackEmbed } from '#/components/StarterPack/StarterPackCard';
import { Text } from '#/components/Typography';
export const ExternalEmbedGif = ({ onRemove, gif, }) => {
    const t = useTheme();
    const { data, error } = useResolveGifQuery(gif);
    const linkInfo = React.useMemo(() => data && {
        title: data.title ?? data.uri,
        uri: data.uri,
        description: data.description ?? '',
        thumb: data.thumb?.source.path,
    }, [data]);
    const loadingStyle = {
        aspectRatio: gif.media_formats.gif.dims[0] / gif.media_formats.gif.dims[1],
        width: '100%',
    };
    return (_jsxs(View, { style: [a.overflow_hidden, t.atoms.border_contrast_medium], children: [linkInfo ? (_jsx(View, { style: { pointerEvents: 'auto' }, children: _jsx(ExternalEmbed, { link: linkInfo, hideAlt: true }) })) : error ? (_jsxs(Container, { style: [a.align_start, a.p_md, a.gap_xs], children: [_jsx(Text, { numberOfLines: 1, style: t.atoms.text_contrast_high, children: gif.url }), _jsx(Text, { numberOfLines: 2, style: [{ color: t.palette.negative_400 }], children: cleanError(error) })] })) : (_jsx(Container, { style: loadingStyle, children: _jsx(Loader, { size: "xl" }) })), _jsx(ExternalEmbedRemoveBtn, { onRemove: onRemove })] }));
};
export const ExternalEmbedLink = ({ uri, hasQuote, onRemove, }) => {
    const t = useTheme();
    const { data, error } = useResolveLinkQuery(uri);
    const linkComponent = React.useMemo(() => {
        if (data) {
            if (data.type === 'external') {
                return (_jsx(ExternalEmbed, { link: {
                        title: data.title || uri,
                        uri,
                        description: data.description,
                        thumb: data.thumb?.source.path,
                    }, hideAlt: true }));
            }
            else if (data.kind === 'feed') {
                return (_jsx(ModeratedFeedEmbed, { embed: {
                        type: 'feed',
                        view: {
                            $type: 'app.bsky.feed.defs#generatorView',
                            ...data.view,
                        },
                    } }));
            }
            else if (data.kind === 'list') {
                return (_jsx(ModeratedListEmbed, { embed: {
                        type: 'list',
                        view: {
                            $type: 'app.bsky.graph.defs#listView',
                            ...data.view,
                        },
                    } }));
            }
            else if (data.kind === 'starter-pack') {
                return _jsx(StarterPackEmbed, { starterPack: data.view });
            }
        }
    }, [data, uri]);
    if (data?.type === 'record' && hasQuote) {
        // This is not currently supported by the data model so don't preview it.
        return null;
    }
    return (_jsxs(View, { style: [a.mb_xl, a.overflow_hidden, t.atoms.border_contrast_medium], children: [linkComponent ? (_jsx(View, { style: { pointerEvents: 'none' }, children: linkComponent })) : error ? (_jsxs(Container, { style: [a.align_start, a.p_md, a.gap_xs], children: [_jsx(Text, { numberOfLines: 1, style: t.atoms.text_contrast_high, children: uri }), _jsx(Text, { numberOfLines: 2, style: [{ color: t.palette.negative_400 }], children: cleanError(error) })] })) : (_jsx(Container, { children: _jsx(Loader, { size: "xl" }) })), _jsx(ExternalEmbedRemoveBtn, { onRemove: onRemove })] }));
};
function Container({ style, children, }) {
    const t = useTheme();
    return (_jsx(View, { style: [
            a.rounded_sm,
            a.border,
            a.align_center,
            a.justify_center,
            a.py_5xl,
            t.atoms.bg_contrast_25,
            t.atoms.border_contrast_medium,
            style,
        ], children: children }));
}
//# sourceMappingURL=ExternalEmbed.js.map