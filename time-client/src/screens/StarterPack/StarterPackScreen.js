import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import React from 'react';
import { View } from 'react-native';
import { Image } from 'expo-image';
import { AppBskyGraphDefs, AppBskyGraphStarterpack, AtUri, RichText as RichTextAPI, } from '@atproto/api';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { msg, Plural, Trans } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { useNavigation } from '@react-navigation/native';
import {} from '@react-navigation/native-stack';
import { useQueryClient } from '@tanstack/react-query';
import { batchedUpdates } from '#/lib/batchedUpdates';
import { HITSLOP_20 } from '#/lib/constants';
import { isBlockedOrBlocking, isMuted } from '#/lib/moderation/blocked-and-muted';
import { makeProfileLink, makeStarterPackLink } from '#/lib/routes/links';
import {} from '#/lib/routes/types';
import { logEvent } from '#/lib/statsig/statsig';
import { cleanError } from '#/lib/strings/errors';
import { getStarterPackOgCard } from '#/lib/strings/starter-pack';
import { logger } from '#/logger';
import { isWeb } from '#/platform/detection';
import { updateProfileShadow } from '#/state/cache/profile-shadow';
import { useModerationOpts } from '#/state/preferences/moderation-opts';
import { getAllListMembers } from '#/state/queries/list-members';
import { useResolvedStarterPackShortLink } from '#/state/queries/resolve-short-link';
import { useResolveDidQuery } from '#/state/queries/resolve-uri';
import { useShortenLink } from '#/state/queries/shorten-link';
import { useDeleteStarterPackMutation } from '#/state/queries/starter-packs';
import { useStarterPackQuery } from '#/state/queries/starter-packs';
import { useAgent, useSession } from '#/state/session';
import { useLoggedOutViewControls } from '#/state/shell/logged-out';
import { ProgressGuideAction, useProgressGuideControls, } from '#/state/shell/progress-guide';
import { useSetActiveStarterPack } from '#/state/shell/starter-pack';
import { PagerWithHeader } from '#/view/com/pager/PagerWithHeader';
import { ProfileSubpageHeader } from '#/view/com/profile/ProfileSubpageHeader';
import * as Toast from '#/view/com/util/Toast';
import { bulkWriteFollows } from '#/screens/Onboarding/util';
import { atoms as a, useBreakpoints, useTheme } from '#/alf';
import { Button, ButtonIcon, ButtonText } from '#/components/Button';
import { useDialogControl } from '#/components/Dialog';
import { ArrowOutOfBoxModified_Stroke2_Corner2_Rounded as ArrowOutOfBoxIcon } from '#/components/icons/ArrowOutOfBox';
import { ChainLink_Stroke2_Corner0_Rounded as ChainLinkIcon } from '#/components/icons/ChainLink';
import { CircleInfo_Stroke2_Corner0_Rounded as CircleInfo } from '#/components/icons/CircleInfo';
import { DotGrid_Stroke2_Corner0_Rounded as Ellipsis } from '#/components/icons/DotGrid';
import { Pencil_Stroke2_Corner0_Rounded as Pencil } from '#/components/icons/Pencil';
import { Trash_Stroke2_Corner0_Rounded as Trash } from '#/components/icons/Trash';
import * as Layout from '#/components/Layout';
import { ListMaybePlaceholder } from '#/components/Lists';
import { Loader } from '#/components/Loader';
import * as Menu from '#/components/Menu';
import { ReportDialog, useReportDialogControl, } from '#/components/moderation/ReportDialog';
import * as Prompt from '#/components/Prompt';
import { RichText } from '#/components/RichText';
import { FeedsList } from '#/components/StarterPack/Main/FeedsList';
import { PostsList } from '#/components/StarterPack/Main/PostsList';
import { ProfilesList } from '#/components/StarterPack/Main/ProfilesList';
import { QrCodeDialog } from '#/components/StarterPack/QrCodeDialog';
import { ShareDialog } from '#/components/StarterPack/ShareDialog';
import { Text } from '#/components/Typography';
import * as bsky from '#/types/bsky';
export function StarterPackScreen({ route }) {
    return (_jsx(Layout.Screen, { children: _jsx(StarterPackScreenInner, { routeParams: route.params }) }));
}
export function StarterPackScreenShort({ route }) {
    const { _ } = useLingui();
    const { data: resolvedStarterPack, isLoading, isError, } = useResolvedStarterPackShortLink({
        code: route.params.code,
    });
    if (isLoading || isError || !resolvedStarterPack) {
        return (_jsx(Layout.Screen, { children: _jsx(ListMaybePlaceholder, { isLoading: isLoading, isError: isError, errorMessage: _(msg `That starter pack could not be found.`), emptyMessage: _(msg `That starter pack could not be found.`) }) }));
    }
    return (_jsx(Layout.Screen, { children: _jsx(StarterPackScreenInner, { routeParams: resolvedStarterPack }) }));
}
export function StarterPackScreenInner({ routeParams, }) {
    const { name, rkey } = routeParams;
    const { _ } = useLingui();
    const { currentAccount } = useSession();
    const moderationOpts = useModerationOpts();
    const { data: did, isLoading: isLoadingDid, isError: isErrorDid, } = useResolveDidQuery(name);
    const { data: starterPack, isLoading: isLoadingStarterPack, isError: isErrorStarterPack, } = useStarterPackQuery({ did, rkey });
    const isValid = starterPack &&
        (starterPack.list || starterPack?.creator?.did === currentAccount?.did) &&
        AppBskyGraphDefs.validateStarterPackView(starterPack) &&
        AppBskyGraphStarterpack.validateRecord(starterPack.record);
    if (!did || !starterPack || !isValid || !moderationOpts) {
        return (_jsx(ListMaybePlaceholder, { isLoading: isLoadingDid || isLoadingStarterPack || !moderationOpts, isError: isErrorDid || isErrorStarterPack || !isValid, errorMessage: _(msg `That starter pack could not be found.`), emptyMessage: _(msg `That starter pack could not be found.`) }));
    }
    if (!starterPack.list && starterPack.creator.did === currentAccount?.did) {
        return _jsx(InvalidStarterPack, { rkey: rkey });
    }
    return (_jsx(StarterPackScreenLoaded, { starterPack: starterPack, routeParams: routeParams, moderationOpts: moderationOpts }));
}
function StarterPackScreenLoaded({ starterPack, routeParams, moderationOpts, }) {
    const showPeopleTab = Boolean(starterPack.list);
    const showFeedsTab = Boolean(starterPack.feeds?.length);
    const showPostsTab = Boolean(starterPack.list);
    const { _ } = useLingui();
    const tabs = [
        ...(showPeopleTab ? [_(msg `People`)] : []),
        ...(showFeedsTab ? [_(msg `Feeds`)] : []),
        ...(showPostsTab ? [_(msg `Posts`)] : []),
    ];
    const qrCodeDialogControl = useDialogControl();
    const shareDialogControl = useDialogControl();
    const shortenLink = useShortenLink();
    const [link, setLink] = React.useState();
    const [imageLoaded, setImageLoaded] = React.useState(false);
    React.useEffect(() => {
        logEvent('starterPack:opened', {
            starterPack: starterPack.uri,
        });
    }, [starterPack.uri]);
    const onOpenShareDialog = React.useCallback(() => {
        const rkey = new AtUri(starterPack.uri).rkey;
        shortenLink(makeStarterPackLink(starterPack.creator.did, rkey)).then(res => {
            setLink(res.url);
        });
        Image.prefetch(getStarterPackOgCard(starterPack))
            .then(() => {
            setImageLoaded(true);
        })
            .catch(() => {
            setImageLoaded(true);
        });
        shareDialogControl.open();
    }, [shareDialogControl, shortenLink, starterPack]);
    React.useEffect(() => {
        if (routeParams.new) {
            onOpenShareDialog();
        }
    }, [onOpenShareDialog, routeParams.new, shareDialogControl]);
    return (_jsxs(_Fragment, { children: [_jsxs(PagerWithHeader, { items: tabs, isHeaderReady: true, renderHeader: () => (_jsx(Header, { starterPack: starterPack, routeParams: routeParams, onOpenShareDialog: onOpenShareDialog })), children: [showPeopleTab
                        ? ({ headerHeight, scrollElRef }) => (_jsx(ProfilesList
                        // Validated above
                        , { 
                            // Validated above
                            listUri: starterPack.list.uri, headerHeight: headerHeight, 
                            // @ts-expect-error
                            scrollElRef: scrollElRef, moderationOpts: moderationOpts }))
                        : null, showFeedsTab
                        ? ({ headerHeight, scrollElRef }) => (_jsx(FeedsList
                        // @ts-expect-error ?
                        , { 
                            // @ts-expect-error ?
                            feeds: starterPack?.feeds, headerHeight: headerHeight, 
                            // @ts-expect-error
                            scrollElRef: scrollElRef }))
                        : null, showPostsTab
                        ? ({ headerHeight, scrollElRef }) => (_jsx(PostsList
                        // Validated above
                        , { 
                            // Validated above
                            listUri: starterPack.list.uri, headerHeight: headerHeight, 
                            // @ts-expect-error
                            scrollElRef: scrollElRef, moderationOpts: moderationOpts }))
                        : null] }), _jsx(QrCodeDialog, { control: qrCodeDialogControl, starterPack: starterPack, link: link }), _jsx(ShareDialog, { control: shareDialogControl, qrDialogControl: qrCodeDialogControl, starterPack: starterPack, link: link, imageLoaded: imageLoaded })] }));
}
function Header({ starterPack, routeParams, onOpenShareDialog, }) {
    const { _ } = useLingui();
    const t = useTheme();
    const { currentAccount, hasSession } = useSession();
    const agent = useAgent();
    const queryClient = useQueryClient();
    const setActiveStarterPack = useSetActiveStarterPack();
    const { requestSwitchToAccount } = useLoggedOutViewControls();
    const { captureAction } = useProgressGuideControls();
    const [isProcessing, setIsProcessing] = React.useState(false);
    const { record, creator } = starterPack;
    const isOwn = creator?.did === currentAccount?.did;
    const joinedAllTimeCount = starterPack.joinedAllTimeCount ?? 0;
    const navigation = useNavigation();
    React.useEffect(() => {
        const onFocus = () => {
            if (hasSession)
                return;
            setActiveStarterPack({
                uri: starterPack.uri,
            });
        };
        const onBeforeRemove = () => {
            if (hasSession)
                return;
            setActiveStarterPack(undefined);
        };
        navigation.addListener('focus', onFocus);
        navigation.addListener('beforeRemove', onBeforeRemove);
        return () => {
            navigation.removeListener('focus', onFocus);
            navigation.removeListener('beforeRemove', onBeforeRemove);
        };
    }, [hasSession, navigation, setActiveStarterPack, starterPack.uri]);
    const onFollowAll = async () => {
        if (!starterPack.list)
            return;
        setIsProcessing(true);
        let listItems = [];
        try {
            listItems = await getAllListMembers(agent, starterPack.list.uri);
        }
        catch (e) {
            setIsProcessing(false);
            Toast.show(_(msg `An error occurred while trying to follow all`), 'xmark');
            logger.error('Failed to get list members for starter pack', {
                safeMessage: e,
            });
            return;
        }
        const dids = listItems
            .filter(li => li.subject.did !== currentAccount?.did &&
            !isBlockedOrBlocking(li.subject) &&
            !isMuted(li.subject) &&
            !li.subject.viewer?.following)
            .map(li => li.subject.did);
        let followUris;
        try {
            followUris = await bulkWriteFollows(agent, dids);
        }
        catch (e) {
            setIsProcessing(false);
            Toast.show(_(msg `An error occurred while trying to follow all`), 'xmark');
            logger.error('Failed to follow all accounts', { safeMessage: e });
        }
        setIsProcessing(false);
        batchedUpdates(() => {
            for (let did of dids) {
                updateProfileShadow(queryClient, did, {
                    followingUri: followUris.get(did),
                });
            }
        });
        Toast.show(_(msg `All accounts have been followed!`));
        captureAction(ProgressGuideAction.Follow, dids.length);
        logEvent('starterPack:followAll', {
            logContext: 'StarterPackProfilesList',
            starterPack: starterPack.uri,
            count: dids.length,
        });
    };
    if (!bsky.dangerousIsType(record, AppBskyGraphStarterpack.isRecord)) {
        return null;
    }
    const richText = record.description
        ? new RichTextAPI({
            text: record.description,
            facets: record.descriptionFacets,
        })
        : undefined;
    return (_jsxs(_Fragment, { children: [_jsx(ProfileSubpageHeader, { isLoading: false, href: makeProfileLink(creator), title: record.name, isOwner: isOwn, avatar: undefined, creator: creator, purpose: "app.bsky.graph.defs#referencelist", avatarType: "starter-pack", children: hasSession ? (_jsxs(View, { style: [a.flex_row, a.gap_sm, a.align_center], children: [isOwn ? (_jsx(Button, { label: _(msg `Share this starter pack`), hitSlop: HITSLOP_20, variant: "solid", color: "primary", size: "small", onPress: onOpenShareDialog, children: _jsx(ButtonText, { children: _jsx(Trans, { children: "Share" }) }) })) : (_jsxs(Button, { label: _(msg `Follow all`), variant: "solid", color: "primary", size: "small", disabled: isProcessing, onPress: onFollowAll, style: [a.flex_row, a.gap_xs, a.align_center], children: [_jsx(ButtonText, { children: _jsx(Trans, { children: "Follow all" }) }), isProcessing && _jsx(Loader, { size: "xs" })] })), _jsx(OverflowMenu, { routeParams: routeParams, starterPack: starterPack, onOpenShareDialog: onOpenShareDialog })] })) : null }), !hasSession || richText || joinedAllTimeCount >= 25 ? (_jsxs(View, { style: [a.px_lg, a.pt_md, a.pb_sm, a.gap_md], children: [richText ? (_jsx(RichText, { value: richText, style: [a.text_md, a.leading_snug] })) : null, !hasSession ? (_jsx(Button, { label: _(msg `Join Bluesky`), onPress: () => {
                            setActiveStarterPack({
                                uri: starterPack.uri,
                            });
                            requestSwitchToAccount({ requestedAccount: 'new' });
                        }, variant: "solid", color: "primary", size: "large", children: _jsx(ButtonText, { style: [a.text_lg], children: _jsx(Trans, { children: "Join Bluesky" }) }) })) : null, joinedAllTimeCount >= 25 ? (_jsxs(View, { style: [a.flex_row, a.align_center, a.gap_sm], children: [_jsx(FontAwesomeIcon, { icon: "arrow-trend-up", size: 12, color: t.atoms.text_contrast_medium.color }), _jsx(Text, { style: [a.font_bold, a.text_sm, t.atoms.text_contrast_medium], children: _jsxs(Trans, { comment: "Number of users (always at least 25) who have joined Bluesky using a specific starter pack", children: [_jsx(Plural, { value: starterPack.joinedAllTimeCount || 0, other: "# people have" }), ' ', "used this starter pack!"] }) })] })) : null] })) : null] }));
}
function OverflowMenu({ starterPack, routeParams, onOpenShareDialog, }) {
    const t = useTheme();
    const { _ } = useLingui();
    const { gtMobile } = useBreakpoints();
    const { currentAccount } = useSession();
    const reportDialogControl = useReportDialogControl();
    const deleteDialogControl = useDialogControl();
    const navigation = useNavigation();
    const { mutate: deleteStarterPack, isPending: isDeletePending, error: deleteError, } = useDeleteStarterPackMutation({
        onSuccess: () => {
            logEvent('starterPack:delete', {});
            deleteDialogControl.close(() => {
                if (navigation.canGoBack()) {
                    navigation.popToTop();
                }
                else {
                    navigation.navigate('Home');
                }
            });
        },
        onError: e => {
            logger.error('Failed to delete starter pack', { safeMessage: e });
        },
    });
    const isOwn = starterPack.creator.did === currentAccount?.did;
    const onDeleteStarterPack = async () => {
        if (!starterPack.list) {
            logger.error(`Unable to delete starterpack because list is missing`);
            return;
        }
        deleteStarterPack({
            rkey: routeParams.rkey,
            listUri: starterPack.list.uri,
        });
        logEvent('starterPack:delete', {});
    };
    return (_jsxs(_Fragment, { children: [_jsxs(Menu.Root, { children: [_jsx(Menu.Trigger, { label: _(msg `Repost or quote post`), children: ({ props }) => (_jsx(Button, { ...props, testID: "headerDropdownBtn", label: _(msg `Open starter pack menu`), hitSlop: HITSLOP_20, variant: "solid", color: "secondary", size: "small", shape: "round", children: _jsx(ButtonIcon, { icon: Ellipsis }) })) }), _jsx(Menu.Outer, { style: { minWidth: 170 }, children: isOwn ? (_jsxs(_Fragment, { children: [_jsxs(Menu.Item, { label: _(msg `Edit starter pack`), testID: "editStarterPackLinkBtn", onPress: () => {
                                        navigation.navigate('StarterPackEdit', {
                                            rkey: routeParams.rkey,
                                        });
                                    }, children: [_jsx(Menu.ItemText, { children: _jsx(Trans, { children: "Edit" }) }), _jsx(Menu.ItemIcon, { icon: Pencil, position: "right" })] }), _jsxs(Menu.Item, { label: _(msg `Delete starter pack`), testID: "deleteStarterPackBtn", onPress: () => {
                                        deleteDialogControl.open();
                                    }, children: [_jsx(Menu.ItemText, { children: _jsx(Trans, { children: "Delete" }) }), _jsx(Menu.ItemIcon, { icon: Trash, position: "right" })] })] })) : (_jsxs(_Fragment, { children: [_jsx(Menu.Group, { children: _jsxs(Menu.Item, { label: isWeb
                                            ? _(msg `Copy link to starter pack`)
                                            : _(msg `Share via...`), testID: "shareStarterPackLinkBtn", onPress: onOpenShareDialog, children: [_jsx(Menu.ItemText, { children: isWeb ? (_jsx(Trans, { children: "Copy link" })) : (_jsx(Trans, { children: "Share via..." })) }), _jsx(Menu.ItemIcon, { icon: isWeb ? ChainLinkIcon : ArrowOutOfBoxIcon, position: "right" })] }) }), _jsxs(Menu.Item, { label: _(msg `Report starter pack`), onPress: () => reportDialogControl.open(), children: [_jsx(Menu.ItemText, { children: _jsx(Trans, { children: "Report starter pack" }) }), _jsx(Menu.ItemIcon, { icon: CircleInfo, position: "right" })] })] })) })] }), starterPack.list && (_jsx(ReportDialog, { control: reportDialogControl, subject: {
                    ...starterPack,
                    $type: 'app.bsky.graph.defs#starterPackView',
                } })), _jsxs(Prompt.Outer, { control: deleteDialogControl, children: [_jsx(Prompt.TitleText, { children: _jsx(Trans, { children: "Delete starter pack?" }) }), _jsx(Prompt.DescriptionText, { children: _jsx(Trans, { children: "Are you sure you want to delete this starter pack?" }) }), deleteError && (_jsxs(View, { style: [
                            a.flex_row,
                            a.gap_sm,
                            a.rounded_sm,
                            a.p_md,
                            a.mb_lg,
                            a.border,
                            t.atoms.border_contrast_medium,
                            t.atoms.bg_contrast_25,
                        ], children: [_jsxs(View, { style: [a.flex_1, a.gap_2xs], children: [_jsx(Text, { style: [a.font_bold], children: _jsx(Trans, { children: "Unable to delete" }) }), _jsx(Text, { style: [a.leading_snug], children: cleanError(deleteError) })] }), _jsx(CircleInfo, { size: "sm", fill: t.palette.negative_400 })] })), _jsxs(Prompt.Actions, { children: [_jsxs(Button, { variant: "solid", color: "negative", size: gtMobile ? 'small' : 'large', label: _(msg `Yes, delete this starter pack`), onPress: onDeleteStarterPack, children: [_jsx(ButtonText, { children: _jsx(Trans, { children: "Delete" }) }), isDeletePending && _jsx(ButtonIcon, { icon: Loader })] }), _jsx(Prompt.Cancel, {})] })] })] }));
}
function InvalidStarterPack({ rkey }) {
    const { _ } = useLingui();
    const t = useTheme();
    const navigation = useNavigation();
    const { gtMobile } = useBreakpoints();
    const [isProcessing, setIsProcessing] = React.useState(false);
    const goBack = () => {
        if (navigation.canGoBack()) {
            navigation.goBack();
        }
        else {
            navigation.replace('Home');
        }
    };
    const { mutate: deleteStarterPack } = useDeleteStarterPackMutation({
        onSuccess: () => {
            setIsProcessing(false);
            goBack();
        },
        onError: e => {
            setIsProcessing(false);
            logger.error('Failed to delete invalid starter pack', { safeMessage: e });
            Toast.show(_(msg `Failed to delete starter pack`), 'xmark');
        },
    });
    return (_jsx(Layout.Content, { centerContent: true, children: _jsxs(View, { style: [a.py_4xl, a.px_xl, a.align_center, a.gap_5xl], children: [_jsxs(View, { style: [a.w_full, a.align_center, a.gap_lg], children: [_jsx(Text, { style: [a.font_bold, a.text_3xl], children: _jsx(Trans, { children: "Starter pack is invalid" }) }), _jsx(Text, { style: [
                                a.text_md,
                                a.text_center,
                                t.atoms.text_contrast_high,
                                { lineHeight: 1.4 },
                                gtMobile ? { width: 450 } : [a.w_full, a.px_lg],
                            ], children: _jsx(Trans, { children: "The starter pack that you are trying to view is invalid. You may delete this starter pack instead." }) })] }), _jsxs(View, { style: [a.gap_md, gtMobile ? { width: 350 } : [a.w_full, a.px_lg]], children: [_jsxs(Button, { variant: "solid", color: "primary", label: _(msg `Delete starter pack`), size: "large", style: [a.rounded_sm, a.overflow_hidden, { paddingVertical: 10 }], disabled: isProcessing, onPress: () => {
                                setIsProcessing(true);
                                deleteStarterPack({ rkey });
                            }, children: [_jsx(ButtonText, { children: _jsx(Trans, { children: "Delete" }) }), isProcessing && _jsx(Loader, { size: "xs", color: "white" })] }), _jsx(Button, { variant: "solid", color: "secondary", label: _(msg `Return to previous page`), size: "large", style: [a.rounded_sm, a.overflow_hidden, { paddingVertical: 10 }], disabled: isProcessing, onPress: goBack, children: _jsx(ButtonText, { children: _jsx(Trans, { children: "Go Back" }) }) })] })] }) }));
}
//# sourceMappingURL=StarterPackScreen.js.map