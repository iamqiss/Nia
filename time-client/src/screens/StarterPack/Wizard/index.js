import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import React from 'react';
import { Keyboard, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { AtUri, } from '@atproto/api';
import { msg, Plural, Trans } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import {} from '@react-navigation/native-stack';
import { STARTER_PACK_MAX_SIZE } from '#/lib/constants';
import { useEnableKeyboardControllerScreen } from '#/lib/hooks/useEnableKeyboardController';
import { createSanitizedDisplayName } from '#/lib/moderation/create-sanitized-display-name';
import {} from '#/lib/routes/types';
import { logEvent } from '#/lib/statsig/statsig';
import { sanitizeDisplayName } from '#/lib/strings/display-names';
import { sanitizeHandle } from '#/lib/strings/handles';
import { enforceLen } from '#/lib/strings/helpers';
import { getStarterPackOgCard, parseStarterPackUri, } from '#/lib/strings/starter-pack';
import { logger } from '#/logger';
import { isNative } from '#/platform/detection';
import { useModerationOpts } from '#/state/preferences/moderation-opts';
import { useAllListMembersQuery } from '#/state/queries/list-members';
import { useProfileQuery } from '#/state/queries/profile';
import { useCreateStarterPackMutation, useEditStarterPackMutation, useStarterPackQuery, } from '#/state/queries/starter-packs';
import { useSession } from '#/state/session';
import { useSetMinimalShellMode } from '#/state/shell';
import * as Toast from '#/view/com/util/Toast';
import { UserAvatar } from '#/view/com/util/UserAvatar';
import { useWizardState, } from '#/screens/StarterPack/Wizard/State';
import { StepDetails } from '#/screens/StarterPack/Wizard/StepDetails';
import { StepFeeds } from '#/screens/StarterPack/Wizard/StepFeeds';
import { StepProfiles } from '#/screens/StarterPack/Wizard/StepProfiles';
import { atoms as a, useTheme, web } from '#/alf';
import { Button, ButtonIcon, ButtonText } from '#/components/Button';
import { useDialogControl } from '#/components/Dialog';
import * as Layout from '#/components/Layout';
import { ListMaybePlaceholder } from '#/components/Lists';
import { Loader } from '#/components/Loader';
import { WizardEditListDialog } from '#/components/StarterPack/Wizard/WizardEditListDialog';
import { Text } from '#/components/Typography';
import { Provider } from './State';
export function Wizard({ route, }) {
    const params = route.params ?? {};
    const rkey = 'rkey' in params ? params.rkey : undefined;
    const fromDialog = 'fromDialog' in params ? params.fromDialog : false;
    const targetDid = 'targetDid' in params ? params.targetDid : undefined;
    const onSuccess = 'onSuccess' in params ? params.onSuccess : undefined;
    const { currentAccount } = useSession();
    const moderationOpts = useModerationOpts();
    const { _ } = useLingui();
    // Use targetDid if provided (from dialog), otherwise use current account
    const profileDid = targetDid || currentAccount.did;
    const { data: starterPack, isLoading: isLoadingStarterPack, isError: isErrorStarterPack, } = useStarterPackQuery({ did: currentAccount.did, rkey });
    const listUri = starterPack?.list?.uri;
    const { data: listItems, isLoading: isLoadingProfiles, isError: isErrorProfiles, } = useAllListMembersQuery(listUri);
    const { data: profile, isLoading: isLoadingProfile, isError: isErrorProfile, } = useProfileQuery({ did: profileDid });
    const isEdit = Boolean(rkey);
    const isReady = (!isEdit || (isEdit && starterPack && listItems)) &&
        profile &&
        moderationOpts;
    if (!isReady) {
        return (_jsx(Layout.Screen, { children: _jsx(ListMaybePlaceholder, { isLoading: isLoadingStarterPack || isLoadingProfiles || isLoadingProfile, isError: isErrorStarterPack || isErrorProfiles || isErrorProfile, errorMessage: _(msg `That starter pack could not be found.`) }) }));
    }
    else if (isEdit && starterPack?.creator.did !== currentAccount?.did) {
        return (_jsx(Layout.Screen, { children: _jsx(ListMaybePlaceholder, { isLoading: false, isError: true, errorMessage: _(msg `That starter pack could not be found.`) }) }));
    }
    return (_jsx(Layout.Screen, { testID: "starterPackWizardScreen", style: web([{ minHeight: 0 }, a.flex_1]), children: _jsx(Provider, { starterPack: starterPack, listItems: listItems, targetProfile: profile, children: _jsx(WizardInner, { currentStarterPack: starterPack, currentListItems: listItems, profile: profile, moderationOpts: moderationOpts, fromDialog: fromDialog, onSuccess: onSuccess }) }) }));
}
function WizardInner({ currentStarterPack, currentListItems, profile, moderationOpts, fromDialog, onSuccess, }) {
    const navigation = useNavigation();
    const { _ } = useLingui();
    const setMinimalShellMode = useSetMinimalShellMode();
    const [state, dispatch] = useWizardState();
    const { currentAccount } = useSession();
    const { data: currentProfile } = useProfileQuery({
        did: currentAccount?.did,
        staleTime: 0,
    });
    const parsed = parseStarterPackUri(currentStarterPack?.uri);
    React.useEffect(() => {
        navigation.setOptions({
            gestureEnabled: false,
        });
    }, [navigation]);
    useEnableKeyboardControllerScreen(true);
    useFocusEffect(React.useCallback(() => {
        setMinimalShellMode(true);
        return () => {
            setMinimalShellMode(false);
        };
    }, [setMinimalShellMode]));
    const getDefaultName = () => {
        const displayName = createSanitizedDisplayName(currentProfile, true);
        return _(msg `${displayName}'s Starter Pack`).slice(0, 50);
    };
    const wizardUiStrings = {
        Details: {
            header: _(msg `Starter Pack`),
            nextBtn: _(msg `Next`),
        },
        Profiles: {
            header: _(msg `Choose People`),
            nextBtn: _(msg `Next`),
        },
        Feeds: {
            header: _(msg `Choose Feeds`),
            nextBtn: state.feeds.length === 0 ? _(msg `Skip`) : _(msg `Finish`),
        },
    };
    const currUiStrings = wizardUiStrings[state.currentStep];
    const onSuccessCreate = (data) => {
        const rkey = new AtUri(data.uri).rkey;
        logEvent('starterPack:create', {
            setName: state.name != null,
            setDescription: state.description != null,
            profilesCount: state.profiles.length,
            feedsCount: state.feeds.length,
        });
        Image.prefetch([getStarterPackOgCard(currentProfile.did, rkey)]);
        dispatch({ type: 'SetProcessing', processing: false });
        if (fromDialog) {
            navigation.goBack();
            onSuccess?.();
        }
        else {
            navigation.replace('StarterPack', {
                name: profile.handle,
                rkey,
                new: true,
            });
        }
    };
    const onSuccessEdit = () => {
        if (navigation.canGoBack()) {
            navigation.goBack();
        }
        else {
            navigation.replace('StarterPack', {
                name: currentAccount.handle,
                rkey: parsed.rkey,
            });
        }
    };
    const { mutate: createStarterPack } = useCreateStarterPackMutation({
        onSuccess: onSuccessCreate,
        onError: e => {
            logger.error('Failed to create starter pack', { safeMessage: e });
            dispatch({ type: 'SetProcessing', processing: false });
            Toast.show(_(msg `Failed to create starter pack`), 'xmark');
        },
    });
    const { mutate: editStarterPack } = useEditStarterPackMutation({
        onSuccess: onSuccessEdit,
        onError: e => {
            logger.error('Failed to edit starter pack', { safeMessage: e });
            dispatch({ type: 'SetProcessing', processing: false });
            Toast.show(_(msg `Failed to create starter pack`), 'xmark');
        },
    });
    const submit = async () => {
        dispatch({ type: 'SetProcessing', processing: true });
        if (currentStarterPack && currentListItems) {
            editStarterPack({
                name: state.name?.trim() || getDefaultName(),
                description: state.description?.trim(),
                profiles: state.profiles,
                feeds: state.feeds,
                currentStarterPack: currentStarterPack,
                currentListItems: currentListItems,
            });
        }
        else {
            createStarterPack({
                name: state.name?.trim() || getDefaultName(),
                description: state.description?.trim(),
                profiles: state.profiles,
                feeds: state.feeds,
            });
        }
    };
    const onNext = () => {
        if (state.currentStep === 'Feeds') {
            submit();
            return;
        }
        const keyboardVisible = Keyboard.isVisible();
        Keyboard.dismiss();
        setTimeout(() => {
            dispatch({ type: 'Next' });
        }, keyboardVisible ? 16 : 0);
    };
    const items = state.currentStep === 'Profiles' ? state.profiles : state.feeds;
    const isEditEnabled = (state.currentStep === 'Profiles' && items.length > 1) ||
        (state.currentStep === 'Feeds' && items.length > 0);
    const editDialogControl = useDialogControl();
    return (_jsxs(Layout.Center, { style: [a.flex_1], children: [_jsxs(Layout.Header.Outer, { children: [_jsx(Layout.Header.BackButton, { label: _(msg `Back`), accessibilityHint: _(msg `Returns to the previous step`), onPress: evt => {
                            if (state.currentStep !== 'Details') {
                                evt.preventDefault();
                                dispatch({ type: 'Back' });
                            }
                        } }), _jsx(Layout.Header.Content, { align: "left", children: _jsx(Layout.Header.TitleText, { children: currUiStrings.header }) }), isEditEnabled ? (_jsx(Button, { label: _(msg `Edit`), color: "secondary", size: "small", onPress: editDialogControl.open, children: _jsx(ButtonText, { children: _jsx(Trans, { children: "Edit" }) }) })) : (_jsx(Layout.Header.Slot, {}))] }), _jsx(Container, { children: state.currentStep === 'Details' ? (_jsx(StepDetails, {})) : state.currentStep === 'Profiles' ? (_jsx(StepProfiles, { moderationOpts: moderationOpts })) : state.currentStep === 'Feeds' ? (_jsx(StepFeeds, { moderationOpts: moderationOpts })) : null }), state.currentStep !== 'Details' && (_jsx(Footer, { onNext: onNext, nextBtnText: currUiStrings.nextBtn })), _jsx(WizardEditListDialog, { control: editDialogControl, state: state, dispatch: dispatch, moderationOpts: moderationOpts, profile: profile })] }));
}
function Container({ children }) {
    const { _ } = useLingui();
    const [state, dispatch] = useWizardState();
    if (state.currentStep === 'Profiles' || state.currentStep === 'Feeds') {
        return _jsx(View, { style: [a.flex_1], children: children });
    }
    return (_jsxs(KeyboardAwareScrollView, { style: [a.flex_1], keyboardShouldPersistTaps: "handled", children: [children, state.currentStep === 'Details' && (_jsx(_Fragment, { children: _jsx(Button, { label: _(msg `Next`), variant: "solid", color: "primary", size: "large", style: [a.mx_xl, a.mb_lg, { marginTop: 35 }], onPress: () => dispatch({ type: 'Next' }), children: _jsx(ButtonText, { children: _jsx(Trans, { children: "Next" }) }) }) }))] }));
}
function Footer({ onNext, nextBtnText, }) {
    const t = useTheme();
    const [state] = useWizardState();
    const { bottom: bottomInset } = useSafeAreaInsets();
    const { currentAccount } = useSession();
    const items = state.currentStep === 'Profiles' ? state.profiles : state.feeds;
    const minimumItems = state.currentStep === 'Profiles' ? 8 : 0;
    const textStyles = [a.text_md];
    return (_jsxs(View, { style: [
            a.border_t,
            a.align_center,
            a.px_lg,
            a.pt_xl,
            a.gap_md,
            t.atoms.bg,
            t.atoms.border_contrast_medium,
            {
                paddingBottom: a.pb_lg.paddingBottom + bottomInset,
            },
            isNative && [
                a.border_l,
                a.border_r,
                t.atoms.shadow_md,
                {
                    borderTopLeftRadius: 14,
                    borderTopRightRadius: 14,
                },
            ],
        ], children: [items.length > minimumItems && (_jsx(View, { style: [a.absolute, { right: 14, top: 31 }], children: _jsxs(Text, { style: [a.font_bold], children: [items.length, "/", state.currentStep === 'Profiles' ? STARTER_PACK_MAX_SIZE : 3] }) })), _jsx(View, { style: [a.flex_row], children: items.slice(0, 6).map((p, index) => (_jsx(View, { style: [
                        a.rounded_full,
                        {
                            borderWidth: 0.5,
                            borderColor: t.atoms.bg.backgroundColor,
                        },
                        state.currentStep === 'Profiles'
                            ? { zIndex: 1 - index, marginLeft: index > 0 ? -8 : 0 }
                            : { marginRight: 4 },
                    ], children: _jsx(UserAvatar, { avatar: p.avatar, size: 32, type: state.currentStep === 'Profiles' ? 'user' : 'algo' }) }, index))) }), state.currentStep === 'Profiles' ? (_jsx(Text, { style: [a.text_center, textStyles], children: items.length < 2 ? (currentAccount?.did === items[0].did ? (_jsx(Trans, { children: "It's just you right now! Add more people to your starter pack by searching above." })) : (_jsxs(Trans, { children: ["It's just", ' ', _jsxs(Text, { style: [a.font_bold, textStyles], emoji: true, children: [getName(items[0]), ' '] }), "right now! Add more people to your starter pack by searching above."] }))) : items.length === 2 ? (currentAccount?.did === items[0].did ? (_jsxs(Trans, { children: [_jsx(Text, { style: [a.font_bold, textStyles], children: "You" }), " and", _jsx(Text, { children: " " }), _jsxs(Text, { style: [a.font_bold, textStyles], emoji: true, children: [getName(items[1] /* [0] is self, skip it */), ' '] }), "are included in your starter pack"] })) : (_jsxs(Trans, { children: [_jsx(Text, { style: [a.font_bold, textStyles], children: getName(items[0]) }), ' ', "and", _jsx(Text, { children: " " }), _jsxs(Text, { style: [a.font_bold, textStyles], emoji: true, children: [getName(items[1] /* [0] is self, skip it */), ' '] }), "are included in your starter pack"] }))) : items.length > 2 ? (_jsxs(Trans, { context: "profiles", children: [_jsxs(Text, { style: [a.font_bold, textStyles], emoji: true, children: [getName(items[1] /* [0] is self, skip it */), ",", ' '] }), _jsxs(Text, { style: [a.font_bold, textStyles], emoji: true, children: [getName(items[2]), ",", ' '] }), "and", ' ', _jsx(Plural, { value: items.length - 2, one: "# other", other: "# others" }), ' ', "are included in your starter pack"] })) : null /* Should not happen. */ })) : state.currentStep === 'Feeds' ? (items.length === 0 ? (_jsxs(View, { style: [a.gap_sm], children: [_jsx(Text, { style: [a.font_bold, a.text_center, textStyles], children: _jsx(Trans, { children: "Add some feeds to your starter pack!" }) }), _jsx(Text, { style: [a.text_center, textStyles], children: _jsx(Trans, { children: "Search for feeds that you want to suggest to others." }) })] })) : (_jsx(Text, { style: [a.text_center, textStyles], children: items.length === 1 ? (_jsxs(Trans, { children: [_jsx(Text, { style: [a.font_bold, textStyles], emoji: true, children: getName(items[0]) }), ' ', "is included in your starter pack"] })) : items.length === 2 ? (_jsxs(Trans, { children: [_jsx(Text, { style: [a.font_bold, textStyles], emoji: true, children: getName(items[0]) }), ' ', "and", _jsx(Text, { children: " " }), _jsxs(Text, { style: [a.font_bold, textStyles], emoji: true, children: [getName(items[1]), ' '] }), "are included in your starter pack"] })) : items.length > 2 ? (_jsxs(Trans, { context: "feeds", children: [_jsxs(Text, { style: [a.font_bold, textStyles], emoji: true, children: [getName(items[0]), ",", ' '] }), _jsxs(Text, { style: [a.font_bold, textStyles], emoji: true, children: [getName(items[1]), ",", ' '] }), "and", ' ', _jsx(Plural, { value: items.length - 2, one: "# other", other: "# others" }), ' ', "are included in your starter pack"] })) : null /* Should not happen. */ }))) : null /* Should not happen. */, _jsxs(View, { style: [
                    a.w_full,
                    a.align_center,
                    a.gap_2xl,
                    isNative ? a.mt_sm : a.mt_md,
                ], children: [state.currentStep === 'Profiles' && items.length < 8 && (_jsx(Text, { style: [a.font_bold, textStyles, t.atoms.text_contrast_medium], children: _jsxs(Trans, { children: ["Add ", 8 - items.length, " more to continue"] }) })), _jsxs(Button, { label: nextBtnText, style: [a.w_full, a.py_md, a.px_2xl], color: "primary", size: "large", onPress: onNext, disabled: !state.canNext ||
                            state.processing ||
                            (state.currentStep === 'Profiles' && items.length < 8), children: [_jsx(ButtonText, { children: nextBtnText }), state.processing && _jsx(ButtonIcon, { icon: Loader })] })] })] }));
}
function getName(item) {
    if (typeof item.displayName === 'string') {
        return enforceLen(sanitizeDisplayName(item.displayName), 28, true);
    }
    else if ('handle' in item && typeof item.handle === 'string') {
        return enforceLen(sanitizeHandle(item.handle), 28, true);
    }
    return '';
}
//# sourceMappingURL=index.js.map