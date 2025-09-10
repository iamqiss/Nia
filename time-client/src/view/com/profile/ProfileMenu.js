import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import React, { memo } from 'react';
import {} from '@atproto/api';
import { msg, Trans } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { useNavigation } from '@react-navigation/native';
import { useQueryClient } from '@tanstack/react-query';
import { useActorStatus } from '#/lib/actor-status';
import { HITSLOP_20 } from '#/lib/constants';
import { makeProfileLink } from '#/lib/routes/links';
import {} from '#/lib/routes/types';
import { shareText, shareUrl } from '#/lib/sharing';
import { toShareUrl } from '#/lib/strings/url-helpers';
import { logger } from '#/logger';
import { isWeb } from '#/platform/detection';
import {} from '#/state/cache/types';
import { useModalControls } from '#/state/modals';
import { RQKEY as profileQueryKey, useProfileBlockMutationQueue, useProfileFollowMutationQueue, useProfileMuteMutationQueue, } from '#/state/queries/profile';
import { useCanGoLive } from '#/state/service-config';
import { useSession } from '#/state/session';
import { EventStopper } from '#/view/com/util/EventStopper';
import * as Toast from '#/view/com/util/Toast';
import { Button, ButtonIcon } from '#/components/Button';
import { useDialogControl } from '#/components/Dialog';
import { StarterPackDialog } from '#/components/dialogs/StarterPackDialog';
import { ArrowOutOfBoxModified_Stroke2_Corner2_Rounded as ArrowOutOfBoxIcon } from '#/components/icons/ArrowOutOfBox';
import { ChainLink_Stroke2_Corner0_Rounded as ChainLinkIcon } from '#/components/icons/ChainLink';
import { CircleCheck_Stroke2_Corner0_Rounded as CircleCheckIcon } from '#/components/icons/CircleCheck';
import { CircleX_Stroke2_Corner0_Rounded as CircleXIcon } from '#/components/icons/CircleX';
import { Clipboard_Stroke2_Corner2_Rounded as ClipboardIcon } from '#/components/icons/Clipboard';
import { DotGrid_Stroke2_Corner0_Rounded as Ellipsis } from '#/components/icons/DotGrid';
import { Flag_Stroke2_Corner0_Rounded as Flag } from '#/components/icons/Flag';
import { ListSparkle_Stroke2_Corner0_Rounded as List } from '#/components/icons/ListSparkle';
import { Live_Stroke2_Corner0_Rounded as LiveIcon } from '#/components/icons/Live';
import { MagnifyingGlass2_Stroke2_Corner0_Rounded as SearchIcon } from '#/components/icons/MagnifyingGlass2';
import { Mute_Stroke2_Corner0_Rounded as Mute } from '#/components/icons/Mute';
import { PeopleRemove2_Stroke2_Corner0_Rounded as UserMinus } from '#/components/icons/PeopleRemove2';
import { PersonCheck_Stroke2_Corner0_Rounded as PersonCheck, PersonX_Stroke2_Corner0_Rounded as PersonX, } from '#/components/icons/Person';
import { PlusLarge_Stroke2_Corner0_Rounded as Plus } from '#/components/icons/Plus';
import { SpeakerVolumeFull_Stroke2_Corner0_Rounded as Unmute } from '#/components/icons/Speaker';
import { StarterPack } from '#/components/icons/StarterPack';
import { EditLiveDialog } from '#/components/live/EditLiveDialog';
import { GoLiveDialog } from '#/components/live/GoLiveDialog';
import * as Menu from '#/components/Menu';
import { ReportDialog, useReportDialogControl, } from '#/components/moderation/ReportDialog';
import * as Prompt from '#/components/Prompt';
import { useFullVerificationState } from '#/components/verification';
import { VerificationCreatePrompt } from '#/components/verification/VerificationCreatePrompt';
import { VerificationRemovePrompt } from '#/components/verification/VerificationRemovePrompt';
import { useDevMode } from '#/storage/hooks/dev-mode';
let ProfileMenu = ({ profile, }) => {
    const { _ } = useLingui();
    const { currentAccount, hasSession } = useSession();
    const { openModal } = useModalControls();
    const reportDialogControl = useReportDialogControl();
    const queryClient = useQueryClient();
    const navigation = useNavigation();
    const isSelf = currentAccount?.did === profile.did;
    const isFollowing = profile.viewer?.following;
    const isBlocked = profile.viewer?.blocking || profile.viewer?.blockedBy;
    const isFollowingBlockedAccount = isFollowing && isBlocked;
    const isLabelerAndNotBlocked = !!profile.associated?.labeler && !isBlocked;
    const [devModeEnabled] = useDevMode();
    const verification = useFullVerificationState({ profile });
    const canGoLive = useCanGoLive(currentAccount?.did);
    const [queueMute, queueUnmute] = useProfileMuteMutationQueue(profile);
    const [queueBlock, queueUnblock] = useProfileBlockMutationQueue(profile);
    const [queueFollow, queueUnfollow] = useProfileFollowMutationQueue(profile, 'ProfileMenu');
    const blockPromptControl = Prompt.usePromptControl();
    const loggedOutWarningPromptControl = Prompt.usePromptControl();
    const goLiveDialogControl = useDialogControl();
    const addToStarterPacksDialogControl = useDialogControl();
    const showLoggedOutWarning = React.useMemo(() => {
        return (profile.did !== currentAccount?.did &&
            !!profile.labels?.find(label => label.val === '!no-unauthenticated'));
    }, [currentAccount, profile]);
    const invalidateProfileQuery = React.useCallback(() => {
        queryClient.invalidateQueries({
            queryKey: profileQueryKey(profile.did),
        });
    }, [queryClient, profile.did]);
    const onPressShare = React.useCallback(() => {
        shareUrl(toShareUrl(makeProfileLink(profile)));
    }, [profile]);
    const onPressAddRemoveLists = React.useCallback(() => {
        openModal({
            name: 'user-add-remove-lists',
            subject: profile.did,
            handle: profile.handle,
            displayName: profile.displayName || profile.handle,
            onAdd: invalidateProfileQuery,
            onRemove: invalidateProfileQuery,
        });
    }, [profile, openModal, invalidateProfileQuery]);
    const onPressMuteAccount = React.useCallback(async () => {
        if (profile.viewer?.muted) {
            try {
                await queueUnmute();
                Toast.show(_(msg({ message: 'Account unmuted', context: 'toast' })));
            }
            catch (e) {
                if (e?.name !== 'AbortError') {
                    logger.error('Failed to unmute account', { message: e });
                    Toast.show(_(msg `There was an issue! ${e.toString()}`), 'xmark');
                }
            }
        }
        else {
            try {
                await queueMute();
                Toast.show(_(msg({ message: 'Account muted', context: 'toast' })));
            }
            catch (e) {
                if (e?.name !== 'AbortError') {
                    logger.error('Failed to mute account', { message: e });
                    Toast.show(_(msg `There was an issue! ${e.toString()}`), 'xmark');
                }
            }
        }
    }, [profile.viewer?.muted, queueUnmute, _, queueMute]);
    const blockAccount = React.useCallback(async () => {
        if (profile.viewer?.blocking) {
            try {
                await queueUnblock();
                Toast.show(_(msg({ message: 'Account unblocked', context: 'toast' })));
            }
            catch (e) {
                if (e?.name !== 'AbortError') {
                    logger.error('Failed to unblock account', { message: e });
                    Toast.show(_(msg `There was an issue! ${e.toString()}`), 'xmark');
                }
            }
        }
        else {
            try {
                await queueBlock();
                Toast.show(_(msg({ message: 'Account blocked', context: 'toast' })));
            }
            catch (e) {
                if (e?.name !== 'AbortError') {
                    logger.error('Failed to block account', { message: e });
                    Toast.show(_(msg `There was an issue! ${e.toString()}`), 'xmark');
                }
            }
        }
    }, [profile.viewer?.blocking, _, queueUnblock, queueBlock]);
    const onPressFollowAccount = React.useCallback(async () => {
        try {
            await queueFollow();
            Toast.show(_(msg({ message: 'Account followed', context: 'toast' })));
        }
        catch (e) {
            if (e?.name !== 'AbortError') {
                logger.error('Failed to follow account', { message: e });
                Toast.show(_(msg `There was an issue! ${e.toString()}`), 'xmark');
            }
        }
    }, [_, queueFollow]);
    const onPressUnfollowAccount = React.useCallback(async () => {
        try {
            await queueUnfollow();
            Toast.show(_(msg({ message: 'Account unfollowed', context: 'toast' })));
        }
        catch (e) {
            if (e?.name !== 'AbortError') {
                logger.error('Failed to unfollow account', { message: e });
                Toast.show(_(msg `There was an issue! ${e.toString()}`), 'xmark');
            }
        }
    }, [_, queueUnfollow]);
    const onPressReportAccount = React.useCallback(() => {
        reportDialogControl.open();
    }, [reportDialogControl]);
    const onPressShareATUri = React.useCallback(() => {
        shareText(`at://${profile.did}`);
    }, [profile.did]);
    const onPressShareDID = React.useCallback(() => {
        shareText(profile.did);
    }, [profile.did]);
    const onPressSearch = React.useCallback(() => {
        navigation.navigate('ProfileSearch', { name: profile.handle });
    }, [navigation, profile.handle]);
    const verificationCreatePromptControl = Prompt.usePromptControl();
    const verificationRemovePromptControl = Prompt.usePromptControl();
    const currentAccountVerifications = profile.verification?.verifications?.filter(v => {
        return v.issuer === currentAccount?.did;
    }) ?? [];
    const status = useActorStatus(profile);
    return (_jsxs(EventStopper, { onKeyDown: false, children: [_jsxs(Menu.Root, { children: [_jsx(Menu.Trigger, { label: _(msg `More options`), children: ({ props }) => {
                            return (_jsx(Button, { ...props, testID: "profileHeaderDropdownBtn", label: _(msg `More options`), hitSlop: HITSLOP_20, variant: "solid", color: "secondary", size: "small", shape: "round", children: _jsx(ButtonIcon, { icon: Ellipsis, size: "sm" }) }));
                        } }), _jsxs(Menu.Outer, { style: { minWidth: 170 }, children: [_jsxs(Menu.Group, { children: [_jsxs(Menu.Item, { testID: "profileHeaderDropdownShareBtn", label: isWeb ? _(msg `Copy link to profile`) : _(msg `Share via...`), onPress: () => {
                                            if (showLoggedOutWarning) {
                                                loggedOutWarningPromptControl.open();
                                            }
                                            else {
                                                onPressShare();
                                            }
                                        }, children: [_jsx(Menu.ItemText, { children: isWeb ? (_jsx(Trans, { children: "Copy link to profile" })) : (_jsx(Trans, { children: "Share via..." })) }), _jsx(Menu.ItemIcon, { icon: isWeb ? ChainLinkIcon : ArrowOutOfBoxIcon })] }), _jsxs(Menu.Item, { testID: "profileHeaderDropdownSearchBtn", label: _(msg `Search posts`), onPress: onPressSearch, children: [_jsx(Menu.ItemText, { children: _jsx(Trans, { children: "Search posts" }) }), _jsx(Menu.ItemIcon, { icon: SearchIcon })] })] }), hasSession && (_jsxs(_Fragment, { children: [_jsx(Menu.Divider, {}), _jsxs(Menu.Group, { children: [!isSelf && (_jsx(_Fragment, { children: (isLabelerAndNotBlocked || isFollowingBlockedAccount) && (_jsxs(Menu.Item, { testID: "profileHeaderDropdownFollowBtn", label: isFollowing
                                                        ? _(msg `Unfollow account`)
                                                        : _(msg `Follow account`), onPress: isFollowing
                                                        ? onPressUnfollowAccount
                                                        : onPressFollowAccount, children: [_jsx(Menu.ItemText, { children: isFollowing ? (_jsx(Trans, { children: "Unfollow account" })) : (_jsx(Trans, { children: "Follow account" })) }), _jsx(Menu.ItemIcon, { icon: isFollowing ? UserMinus : Plus })] })) })), _jsxs(Menu.Item, { testID: "profileHeaderDropdownStarterPackAddRemoveBtn", label: _(msg `Add to starter packs`), onPress: addToStarterPacksDialogControl.open, children: [_jsx(Menu.ItemText, { children: _jsx(Trans, { children: "Add to starter packs" }) }), _jsx(Menu.ItemIcon, { icon: StarterPack })] }), _jsxs(Menu.Item, { testID: "profileHeaderDropdownListAddRemoveBtn", label: _(msg `Add to lists`), onPress: onPressAddRemoveLists, children: [_jsx(Menu.ItemText, { children: _jsx(Trans, { children: "Add to lists" }) }), _jsx(Menu.ItemIcon, { icon: List })] }), isSelf && canGoLive && (_jsxs(Menu.Item, { testID: "profileHeaderDropdownListAddRemoveBtn", label: status.isActive
                                                    ? _(msg `Edit live status`)
                                                    : _(msg `Go live`), onPress: goLiveDialogControl.open, children: [_jsx(Menu.ItemText, { children: status.isActive ? (_jsx(Trans, { children: "Edit live status" })) : (_jsx(Trans, { children: "Go live" })) }), _jsx(Menu.ItemIcon, { icon: LiveIcon })] })), verification.viewer.role === 'verifier' &&
                                                !verification.profile.isViewer &&
                                                (verification.viewer.hasIssuedVerification ? (_jsxs(Menu.Item, { testID: "profileHeaderDropdownVerificationRemoveButton", label: _(msg `Remove verification`), onPress: () => verificationRemovePromptControl.open(), children: [_jsx(Menu.ItemText, { children: _jsx(Trans, { children: "Remove verification" }) }), _jsx(Menu.ItemIcon, { icon: CircleXIcon })] })) : (_jsxs(Menu.Item, { testID: "profileHeaderDropdownVerificationCreateButton", label: _(msg `Verify account`), onPress: () => verificationCreatePromptControl.open(), children: [_jsx(Menu.ItemText, { children: _jsx(Trans, { children: "Verify account" }) }), _jsx(Menu.ItemIcon, { icon: CircleCheckIcon })] }))), !isSelf && (_jsxs(_Fragment, { children: [!profile.viewer?.blocking &&
                                                        !profile.viewer?.mutedByList && (_jsxs(Menu.Item, { testID: "profileHeaderDropdownMuteBtn", label: profile.viewer?.muted
                                                            ? _(msg `Unmute account`)
                                                            : _(msg `Mute account`), onPress: onPressMuteAccount, children: [_jsx(Menu.ItemText, { children: profile.viewer?.muted ? (_jsx(Trans, { children: "Unmute account" })) : (_jsx(Trans, { children: "Mute account" })) }), _jsx(Menu.ItemIcon, { icon: profile.viewer?.muted ? Unmute : Mute })] })), !profile.viewer?.blockingByList && (_jsxs(Menu.Item, { testID: "profileHeaderDropdownBlockBtn", label: profile.viewer
                                                            ? _(msg `Unblock account`)
                                                            : _(msg `Block account`), onPress: () => blockPromptControl.open(), children: [_jsx(Menu.ItemText, { children: profile.viewer?.blocking ? (_jsx(Trans, { children: "Unblock account" })) : (_jsx(Trans, { children: "Block account" })) }), _jsx(Menu.ItemIcon, { icon: profile.viewer?.blocking ? PersonCheck : PersonX })] })), _jsxs(Menu.Item, { testID: "profileHeaderDropdownReportBtn", label: _(msg `Report account`), onPress: onPressReportAccount, children: [_jsx(Menu.ItemText, { children: _jsx(Trans, { children: "Report account" }) }), _jsx(Menu.ItemIcon, { icon: Flag })] })] }))] })] })), devModeEnabled ? (_jsxs(_Fragment, { children: [_jsx(Menu.Divider, {}), _jsxs(Menu.Group, { children: [_jsxs(Menu.Item, { testID: "profileHeaderDropdownShareATURIBtn", label: _(msg `Copy at:// URI`), onPress: onPressShareATUri, children: [_jsx(Menu.ItemText, { children: _jsx(Trans, { children: "Copy at:// URI" }) }), _jsx(Menu.ItemIcon, { icon: ClipboardIcon })] }), _jsxs(Menu.Item, { testID: "profileHeaderDropdownShareDIDBtn", label: _(msg `Copy DID`), onPress: onPressShareDID, children: [_jsx(Menu.ItemText, { children: _jsx(Trans, { children: "Copy DID" }) }), _jsx(Menu.ItemIcon, { icon: ClipboardIcon })] })] })] })) : null] })] }), _jsx(StarterPackDialog, { control: addToStarterPacksDialogControl, targetDid: profile.did }), _jsx(ReportDialog, { control: reportDialogControl, subject: {
                    ...profile,
                    $type: 'app.bsky.actor.defs#profileViewDetailed',
                } }), _jsx(Prompt.Basic, { control: blockPromptControl, title: profile.viewer?.blocking
                    ? _(msg `Unblock Account?`)
                    : _(msg `Block Account?`), description: profile.viewer?.blocking
                    ? _(msg `The account will be able to interact with you after unblocking.`)
                    : profile.associated?.labeler
                        ? _(msg `Blocking will not prevent labels from being applied on your account, but it will stop this account from replying in your threads or interacting with you.`)
                        : _(msg `Blocked accounts cannot reply in your threads, mention you, or otherwise interact with you.`), onConfirm: blockAccount, confirmButtonCta: profile.viewer?.blocking ? _(msg `Unblock`) : _(msg `Block`), confirmButtonColor: profile.viewer?.blocking ? undefined : 'negative' }), _jsx(Prompt.Basic, { control: loggedOutWarningPromptControl, title: _(msg `Note about sharing`), description: _(msg `This profile is only visible to logged-in users. It won't be visible to people who aren't signed in.`), onConfirm: onPressShare, confirmButtonCta: _(msg `Share anyway`) }), _jsx(VerificationCreatePrompt, { control: verificationCreatePromptControl, profile: profile }), _jsx(VerificationRemovePrompt, { control: verificationRemovePromptControl, profile: profile, verifications: currentAccountVerifications }), status.isActive ? (_jsx(EditLiveDialog, { control: goLiveDialogControl, status: status, embed: status.embed })) : (_jsx(GoLiveDialog, { control: goLiveDialogControl, profile: profile }))] }));
};
ProfileMenu = memo(ProfileMenu);
export { ProfileMenu };
//# sourceMappingURL=ProfileMenu.js.map