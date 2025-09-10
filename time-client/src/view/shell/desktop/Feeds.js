import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { View } from 'react-native';
import { msg } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { useNavigation, useNavigationState } from '@react-navigation/native';
import { getCurrentRoute } from '#/lib/routes/helpers';
import {} from '#/lib/routes/types';
import { emitSoftReset } from '#/state/events';
import { usePinnedFeedsInfos } from '#/state/queries/feed';
import { useSelectedFeed, useSetSelectedFeed } from '#/state/shell/selected-feed';
import { atoms as a, useTheme, web } from '#/alf';
import { createStaticClick, InlineLinkText } from '#/components/Link';
export function DesktopFeeds() {
    const t = useTheme();
    const { _ } = useLingui();
    const { data: pinnedFeedInfos, error, isLoading } = usePinnedFeedsInfos();
    const selectedFeed = useSelectedFeed();
    const setSelectedFeed = useSetSelectedFeed();
    const navigation = useNavigation();
    const route = useNavigationState(state => {
        if (!state) {
            return { name: 'Home' };
        }
        return getCurrentRoute(state);
    });
    if (isLoading) {
        return (_jsx(View, { style: [
                {
                    gap: 10,
                    paddingVertical: 2,
                },
            ], children: Array(5)
                .fill(0)
                .map((_, i) => (_jsx(View, { style: [
                    a.rounded_sm,
                    t.atoms.bg_contrast_25,
                    {
                        height: 16,
                        width: i % 2 === 0 ? '60%' : '80%',
                    },
                ] }, i))) }));
    }
    if (error || !pinnedFeedInfos) {
        return null;
    }
    return (_jsxs(View, { style: [
            web({
                gap: 10,
                /*
                 * Small padding prevents overflow prior to actually overflowing the
                 * height of the screen with lots of feeds.
                 */
                paddingVertical: 2,
                marginHorizontal: -2,
                overflowY: 'auto',
            }),
        ], children: [pinnedFeedInfos.map(feedInfo => {
                const feed = feedInfo.feedDescriptor;
                const current = route.name === 'Home' && feed === selectedFeed;
                return (_jsx(InlineLinkText, { label: feedInfo.displayName, ...createStaticClick(() => {
                        setSelectedFeed(feed);
                        navigation.navigate('Home');
                        if (route.name === 'Home' && feed === selectedFeed) {
                            emitSoftReset();
                        }
                    }), style: [
                        a.text_md,
                        a.leading_snug,
                        current
                            ? [a.font_bold, t.atoms.text]
                            : [t.atoms.text_contrast_medium],
                        web({
                            marginHorizontal: 2,
                            width: 'calc(100% - 4px)',
                        }),
                    ], numberOfLines: 1, children: feedInfo.displayName }, feedInfo.uri));
            }), _jsx(InlineLinkText, { to: "/feeds", label: _(msg `More feeds`), style: [
                    a.text_md,
                    a.leading_snug,
                    web({
                        marginHorizontal: 2,
                        width: 'calc(100% - 4px)',
                    }),
                ], numberOfLines: 1, children: _(msg `More feeds`) })] }));
}
//# sourceMappingURL=Feeds.js.map