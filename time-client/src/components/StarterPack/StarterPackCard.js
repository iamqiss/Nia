import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { View } from 'react-native';
import { Image } from 'expo-image';
import { AppBskyGraphStarterpack, AtUri } from '@atproto/api';
import { msg, Plural, Trans } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { useQueryClient } from '@tanstack/react-query';
import { sanitizeHandle } from '#/lib/strings/handles';
import { getStarterPackOgCard } from '#/lib/strings/starter-pack';
import { precacheResolvedUri } from '#/state/queries/resolve-uri';
import { precacheStarterPack } from '#/state/queries/starter-packs';
import { useSession } from '#/state/session';
import { atoms as a, useTheme } from '#/alf';
import { StarterPack as StarterPackIcon } from '#/components/icons/StarterPack';
import { Link as BaseLink, } from '#/components/Link';
import { Text } from '#/components/Typography';
import * as bsky from '#/types/bsky';
export function Default({ starterPack, }) {
    if (!starterPack)
        return null;
    return (_jsx(Link, { starterPack: starterPack, children: _jsx(Card, { starterPack: starterPack }) }));
}
export function Notification({ starterPack, }) {
    if (!starterPack)
        return null;
    return (_jsx(Link, { starterPack: starterPack, children: _jsx(Card, { starterPack: starterPack, noIcon: true, noDescription: true }) }));
}
export function Card({ starterPack, noIcon, noDescription, }) {
    const { record, creator, joinedAllTimeCount } = starterPack;
    const { _ } = useLingui();
    const t = useTheme();
    const { currentAccount } = useSession();
    if (!bsky.dangerousIsType(record, AppBskyGraphStarterpack.isRecord)) {
        return null;
    }
    return (_jsxs(View, { style: [a.w_full, a.gap_md], children: [_jsxs(View, { style: [a.flex_row, a.gap_sm, a.w_full], children: [!noIcon ? _jsx(StarterPackIcon, { width: 40, gradient: "sky" }) : null, _jsxs(View, { style: [a.flex_1], children: [_jsx(Text, { emoji: true, style: [a.text_md, a.font_bold, a.leading_snug], numberOfLines: 2, children: record.name }), _jsx(Text, { emoji: true, style: [a.leading_snug, t.atoms.text_contrast_medium], numberOfLines: 1, children: creator?.did === currentAccount?.did
                                    ? _(msg `Starter pack by you`)
                                    : _(msg `Starter pack by ${sanitizeHandle(creator.handle, '@')}`) })] })] }), !noDescription && record.description ? (_jsx(Text, { emoji: true, numberOfLines: 3, style: [a.leading_snug], children: record.description })) : null, !!joinedAllTimeCount && joinedAllTimeCount >= 50 && (_jsx(Text, { style: [a.font_bold, t.atoms.text_contrast_medium], children: _jsxs(Trans, { comment: "Number of users (always at least 50) who have joined Bluesky using a specific starter pack", children: [_jsx(Plural, { value: joinedAllTimeCount, other: "# users have" }), " joined!"] }) }))] }));
}
export function useStarterPackLink({ view, }) {
    const { _ } = useLingui();
    const qc = useQueryClient();
    const { rkey, handleOrDid } = React.useMemo(() => {
        const rkey = new AtUri(view.uri).rkey;
        const { creator } = view;
        return { rkey, handleOrDid: creator.handle || creator.did };
    }, [view]);
    const precache = () => {
        precacheResolvedUri(qc, view.creator.handle, view.creator.did);
        precacheStarterPack(qc, view);
    };
    return {
        to: `/starter-pack/${handleOrDid}/${rkey}`,
        label: AppBskyGraphStarterpack.isRecord(view.record)
            ? _(msg `Navigate to ${view.record.name}`)
            : _(msg `Navigate to starter pack`),
        precache,
    };
}
export function Link({ starterPack, children, }) {
    const { _ } = useLingui();
    const queryClient = useQueryClient();
    const { record } = starterPack;
    const { rkey, handleOrDid } = React.useMemo(() => {
        const rkey = new AtUri(starterPack.uri).rkey;
        const { creator } = starterPack;
        return { rkey, handleOrDid: creator.handle || creator.did };
    }, [starterPack]);
    if (!AppBskyGraphStarterpack.isRecord(record)) {
        return null;
    }
    return (_jsx(BaseLink, { to: `/starter-pack/${handleOrDid}/${rkey}`, label: _(msg `Navigate to ${record.name}`), onPress: () => {
            precacheResolvedUri(queryClient, starterPack.creator.handle, starterPack.creator.did);
            precacheStarterPack(queryClient, starterPack);
        }, style: [a.flex_col, a.align_start], children: children }));
}
export function Embed({ starterPack, }) {
    const t = useTheme();
    const imageUri = getStarterPackOgCard(starterPack);
    return (_jsx(View, { style: [
            a.border,
            a.rounded_sm,
            a.overflow_hidden,
            t.atoms.border_contrast_low,
        ], children: _jsxs(Link, { starterPack: starterPack, children: [_jsx(Image, { source: imageUri, style: [a.w_full, { aspectRatio: 1.91 }], accessibilityIgnoresInvertColors: true }), _jsx(View, { style: [a.px_sm, a.py_md], children: _jsx(Card, { starterPack: starterPack }) })] }) }));
}
//# sourceMappingURL=StarterPackCard.js.map