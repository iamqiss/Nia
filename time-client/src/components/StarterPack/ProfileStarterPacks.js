import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useCallback, useEffect, useImperativeHandle, useState, } from 'react';
import { findNodeHandle, View, } from 'react-native';
import {} from '@atproto/api';
import { msg, Trans } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { useNavigation } from '@react-navigation/native';
import { useGenerateStarterPackMutation } from '#/lib/generate-starterpack';
import { useBottomBarOffset } from '#/lib/hooks/useBottomBarOffset';
import { useRequireEmailVerification } from '#/lib/hooks/useRequireEmailVerification';
import { useWebMediaQueries } from '#/lib/hooks/useWebMediaQueries';
import {} from '#/lib/routes/types';
import { parseStarterPackUri } from '#/lib/strings/starter-pack';
import { logger } from '#/logger';
import { isIOS } from '#/platform/detection';
import { useActorStarterPacksQuery } from '#/state/queries/actor-starter-packs';
import { List } from '#/view/com/util/List';
import { FeedLoadingPlaceholder } from '#/view/com/util/LoadingPlaceholder';
import { atoms as a, ios, useTheme } from '#/alf';
import { Button, ButtonIcon, ButtonText } from '#/components/Button';
import { useDialogControl } from '#/components/Dialog';
import { PlusSmall_Stroke2_Corner0_Rounded as Plus } from '#/components/icons/Plus';
import { LinearGradientBackground } from '#/components/LinearGradientBackground';
import { Loader } from '#/components/Loader';
import * as Prompt from '#/components/Prompt';
import { Default as StarterPackCard } from '#/components/StarterPack/StarterPackCard';
import { Text } from '#/components/Typography';
function keyExtractor(item) {
    return item.uri;
}
export const ProfileStarterPacks = React.forwardRef(function ProfileFeedgensImpl({ scrollElRef, did, headerOffset, enabled, style, testID, setScrollViewTag, isMe, }, ref) {
    const t = useTheme();
    const bottomBarOffset = useBottomBarOffset(100);
    const [isPTRing, setIsPTRing] = useState(false);
    const { data, refetch, isError, hasNextPage, isFetchingNextPage, fetchNextPage, } = useActorStarterPacksQuery({ did, enabled });
    const { isTabletOrDesktop } = useWebMediaQueries();
    const items = data?.pages.flatMap(page => page.starterPacks);
    useImperativeHandle(ref, () => ({
        scrollToTop: () => { },
    }));
    const onRefresh = useCallback(async () => {
        setIsPTRing(true);
        try {
            await refetch();
        }
        catch (err) {
            logger.error('Failed to refresh starter packs', { message: err });
        }
        setIsPTRing(false);
    }, [refetch, setIsPTRing]);
    const onEndReached = React.useCallback(async () => {
        if (isFetchingNextPage || !hasNextPage || isError)
            return;
        try {
            await fetchNextPage();
        }
        catch (err) {
            logger.error('Failed to load more starter packs', { message: err });
        }
    }, [isFetchingNextPage, hasNextPage, isError, fetchNextPage]);
    useEffect(() => {
        if (isIOS && enabled && scrollElRef.current) {
            const nativeTag = findNodeHandle(scrollElRef.current);
            setScrollViewTag(nativeTag);
        }
    }, [enabled, scrollElRef, setScrollViewTag]);
    const renderItem = useCallback(({ item, index }) => {
        return (_jsx(View, { style: [
                a.p_lg,
                (isTabletOrDesktop || index !== 0) && a.border_t,
                t.atoms.border_contrast_low,
            ], children: _jsx(StarterPackCard, { starterPack: item }) }));
    }, [isTabletOrDesktop, t.atoms.border_contrast_low]);
    return (_jsx(View, { testID: testID, style: style, children: _jsx(List, { testID: testID ? `${testID}-flatlist` : undefined, ref: scrollElRef, data: items, renderItem: renderItem, keyExtractor: keyExtractor, refreshing: isPTRing, headerOffset: headerOffset, progressViewOffset: ios(0), contentContainerStyle: { paddingBottom: headerOffset + bottomBarOffset }, removeClippedSubviews: true, desktopFixedHeight: true, onEndReached: onEndReached, onRefresh: onRefresh, ListEmptyComponent: data ? (isMe ? Empty : undefined) : FeedLoadingPlaceholder, ListFooterComponent: !!data && items?.length !== 0 && isMe ? CreateAnother : undefined }) }));
});
function CreateAnother() {
    const { _ } = useLingui();
    const t = useTheme();
    const navigation = useNavigation();
    return (_jsx(View, { style: [
            a.pr_md,
            a.pt_lg,
            a.gap_lg,
            a.border_t,
            t.atoms.border_contrast_low,
        ], children: _jsxs(Button, { label: _(msg `Create a starter pack`), variant: "solid", color: "secondary", size: "small", style: [a.self_center], onPress: () => navigation.navigate('StarterPackWizard', {}), children: [_jsx(ButtonText, { children: _jsx(Trans, { children: "Create another" }) }), _jsx(ButtonIcon, { icon: Plus, position: "right" })] }) }));
}
function Empty() {
    const { _ } = useLingui();
    const navigation = useNavigation();
    const confirmDialogControl = useDialogControl();
    const followersDialogControl = useDialogControl();
    const errorDialogControl = useDialogControl();
    const requireEmailVerification = useRequireEmailVerification();
    const [isGenerating, setIsGenerating] = useState(false);
    const { mutate: generateStarterPack } = useGenerateStarterPackMutation({
        onSuccess: ({ uri }) => {
            const parsed = parseStarterPackUri(uri);
            if (parsed) {
                navigation.push('StarterPack', {
                    name: parsed.name,
                    rkey: parsed.rkey,
                });
            }
            setIsGenerating(false);
        },
        onError: e => {
            logger.error('Failed to generate starter pack', { safeMessage: e });
            setIsGenerating(false);
            if (e.message.includes('NOT_ENOUGH_FOLLOWERS')) {
                followersDialogControl.open();
            }
            else {
                errorDialogControl.open();
            }
        },
    });
    const generate = () => {
        setIsGenerating(true);
        generateStarterPack();
    };
    const openConfirmDialog = useCallback(() => {
        confirmDialogControl.open();
    }, [confirmDialogControl]);
    const wrappedOpenConfirmDialog = requireEmailVerification(openConfirmDialog, {
        instructions: [
            _jsx(Trans, { children: "Before creating a starter pack, you must first verify your email." }, "confirm"),
        ],
    });
    const navToWizard = useCallback(() => {
        navigation.navigate('StarterPackWizard', {});
    }, [navigation]);
    const wrappedNavToWizard = requireEmailVerification(navToWizard, {
        instructions: [
            _jsx(Trans, { children: "Before creating a starter pack, you must first verify your email." }, "nav"),
        ],
    });
    return (_jsxs(LinearGradientBackground, { style: [
            a.px_lg,
            a.py_lg,
            a.justify_between,
            a.gap_lg,
            a.shadow_lg,
            { marginTop: a.border.borderWidth },
        ], children: [_jsxs(View, { style: [a.gap_xs], children: [_jsx(Text, { style: [a.font_bold, a.text_lg, { color: 'white' }], children: _jsx(Trans, { children: "You haven't created a starter pack yet!" }) }), _jsx(Text, { style: [a.text_md, { color: 'white' }], children: _jsx(Trans, { children: "Starter packs let you easily share your favorite feeds and people with your friends." }) })] }), _jsxs(View, { style: [a.flex_row, a.gap_md, { marginLeft: 'auto' }], children: [_jsxs(Button, { label: _(msg `Create a starter pack for me`), variant: "ghost", color: "primary", size: "small", disabled: isGenerating, onPress: wrappedOpenConfirmDialog, style: { backgroundColor: 'transparent' }, children: [_jsx(ButtonText, { style: { color: 'white' }, children: _jsx(Trans, { children: "Make one for me" }) }), isGenerating && _jsx(Loader, { size: "md" })] }), _jsx(Button, { label: _(msg `Create a starter pack`), variant: "ghost", color: "primary", size: "small", disabled: isGenerating, onPress: wrappedNavToWizard, style: {
                            backgroundColor: 'white',
                            borderColor: 'white',
                            width: 100,
                        }, hoverStyle: [{ backgroundColor: '#dfdfdf' }], children: _jsx(ButtonText, { children: _jsx(Trans, { children: "Create" }) }) })] }), _jsxs(Prompt.Outer, { control: confirmDialogControl, children: [_jsx(Prompt.TitleText, { children: _jsx(Trans, { children: "Generate a starter pack" }) }), _jsx(Prompt.DescriptionText, { children: _jsx(Trans, { children: "Bluesky will choose a set of recommended accounts from people in your network." }) }), _jsxs(Prompt.Actions, { children: [_jsx(Prompt.Action, { color: "primary", cta: _(msg `Choose for me`), onPress: generate }), _jsx(Prompt.Action, { color: "secondary", cta: _(msg `Let me choose`), onPress: () => {
                                    navigation.navigate('StarterPackWizard', {});
                                } })] })] }), _jsx(Prompt.Basic, { control: followersDialogControl, title: _(msg `Oops!`), description: _(msg `You must be following at least seven other people to generate a starter pack.`), onConfirm: () => { }, showCancel: false }), _jsx(Prompt.Basic, { control: errorDialogControl, title: _(msg `Oops!`), description: _(msg `An error occurred while generating your starter pack. Want to try again?`), onConfirm: generate, confirmButtonCta: _(msg `Retry`) })] }));
}
//# sourceMappingURL=ProfileStarterPacks.js.map