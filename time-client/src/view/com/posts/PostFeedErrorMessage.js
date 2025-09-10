import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import React from 'react';
import { View } from 'react-native';
import { AppBskyFeedGetAuthorFeed, AtUri, } from '@atproto/api';
import { msg as msgLingui, Trans } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { useNavigation } from '@react-navigation/native';
import { usePalette } from '#/lib/hooks/usePalette';
import {} from '#/lib/routes/types';
import { cleanError } from '#/lib/strings/errors';
import { logger } from '#/logger';
import {} from '#/state/queries/post-feed';
import { useRemoveFeedMutation } from '#/state/queries/preferences';
import * as Prompt from '#/components/Prompt';
import { EmptyState } from '../util/EmptyState';
import { ErrorMessage } from '../util/error/ErrorMessage';
import { Button } from '../util/forms/Button';
import { Text } from '../util/text/Text';
import * as Toast from '../util/Toast';
export var KnownError;
(function (KnownError) {
    KnownError["Block"] = "Block";
    KnownError["FeedgenDoesNotExist"] = "FeedgenDoesNotExist";
    KnownError["FeedgenMisconfigured"] = "FeedgenMisconfigured";
    KnownError["FeedgenBadResponse"] = "FeedgenBadResponse";
    KnownError["FeedgenOffline"] = "FeedgenOffline";
    KnownError["FeedgenUnknown"] = "FeedgenUnknown";
    KnownError["FeedSignedInOnly"] = "FeedSignedInOnly";
    KnownError["FeedTooManyRequests"] = "FeedTooManyRequests";
    KnownError["Unknown"] = "Unknown";
})(KnownError || (KnownError = {}));
export function PostFeedErrorMessage({ feedDesc, error, onPressTryAgain, savedFeedConfig, }) {
    const { _: _l } = useLingui();
    const knownError = React.useMemo(() => detectKnownError(feedDesc, error), [feedDesc, error]);
    if (typeof knownError !== 'undefined' &&
        knownError !== KnownError.Unknown &&
        feedDesc.startsWith('feedgen')) {
        return (_jsx(FeedgenErrorMessage, { feedDesc: feedDesc, knownError: knownError, rawError: error, savedFeedConfig: savedFeedConfig }));
    }
    if (knownError === KnownError.Block) {
        return (_jsx(EmptyState, { icon: "ban", message: _l(msgLingui `Posts hidden`), style: { paddingVertical: 40 } }));
    }
    return (_jsx(ErrorMessage, { message: cleanError(error), onPressTryAgain: onPressTryAgain }));
}
function FeedgenErrorMessage({ feedDesc, knownError, rawError, savedFeedConfig, }) {
    const pal = usePalette('default');
    const { _: _l } = useLingui();
    const navigation = useNavigation();
    const msg = React.useMemo(() => ({
        [KnownError.Unknown]: '',
        [KnownError.Block]: '',
        [KnownError.FeedgenDoesNotExist]: _l(msgLingui `Hmm, we're having trouble finding this feed. It may have been deleted.`),
        [KnownError.FeedgenMisconfigured]: _l(msgLingui `Hmm, the feed server appears to be misconfigured. Please let the feed owner know about this issue.`),
        [KnownError.FeedgenBadResponse]: _l(msgLingui `Hmm, the feed server gave a bad response. Please let the feed owner know about this issue.`),
        [KnownError.FeedgenOffline]: _l(msgLingui `Hmm, the feed server appears to be offline. Please let the feed owner know about this issue.`),
        [KnownError.FeedSignedInOnly]: _l(msgLingui `This content is not viewable without a Bluesky account.`),
        [KnownError.FeedgenUnknown]: _l(msgLingui `Hmm, some kind of issue occurred when contacting the feed server. Please let the feed owner know about this issue.`),
        [KnownError.FeedTooManyRequests]: _l(msgLingui `This feed is currently receiving high traffic and is temporarily unavailable. Please try again later.`),
    })[knownError], [_l, knownError]);
    const [_, uri] = feedDesc.split('|');
    const [ownerDid] = safeParseFeedgenUri(uri);
    const removePromptControl = Prompt.usePromptControl();
    const { mutateAsync: removeFeed } = useRemoveFeedMutation();
    const onViewProfile = React.useCallback(() => {
        navigation.navigate('Profile', { name: ownerDid });
    }, [navigation, ownerDid]);
    const onPressRemoveFeed = React.useCallback(() => {
        removePromptControl.open();
    }, [removePromptControl]);
    const onRemoveFeed = React.useCallback(async () => {
        try {
            if (!savedFeedConfig)
                return;
            await removeFeed(savedFeedConfig);
        }
        catch (err) {
            Toast.show(_l(msgLingui `There was an issue removing this feed. Please check your internet connection and try again.`), 'exclamation-circle');
            logger.error('Failed to remove feed', { message: err });
        }
    }, [removeFeed, _l, savedFeedConfig]);
    const cta = React.useMemo(() => {
        switch (knownError) {
            case KnownError.FeedSignedInOnly: {
                return null;
            }
            case KnownError.FeedgenDoesNotExist:
            case KnownError.FeedgenMisconfigured:
            case KnownError.FeedgenBadResponse:
            case KnownError.FeedgenOffline:
            case KnownError.FeedgenUnknown: {
                return (_jsxs(View, { style: { flexDirection: 'row', alignItems: 'center', gap: 10 }, children: [knownError === KnownError.FeedgenDoesNotExist &&
                            savedFeedConfig && (_jsx(Button, { type: "inverted", label: _l(msgLingui `Remove feed`), onPress: onRemoveFeed })), _jsx(Button, { type: "default-light", label: _l(msgLingui `View profile`), onPress: onViewProfile })] }));
            }
        }
    }, [knownError, onViewProfile, onRemoveFeed, _l, savedFeedConfig]);
    return (_jsxs(_Fragment, { children: [_jsxs(View, { style: [
                    pal.border,
                    pal.viewLight,
                    {
                        borderTopWidth: 1,
                        paddingHorizontal: 20,
                        paddingVertical: 18,
                        gap: 12,
                    },
                ], children: [_jsx(Text, { style: pal.text, children: msg }), rawError?.message && (_jsx(Text, { style: pal.textLight, children: _jsxs(Trans, { children: ["Message from server: ", rawError.message] }) })), cta] }), _jsx(Prompt.Basic, { control: removePromptControl, title: _l(msgLingui `Remove feed?`), description: _l(msgLingui `Remove this feed from your saved feeds`), onConfirm: onPressRemoveFeed, confirmButtonCta: _l(msgLingui `Remove`), confirmButtonColor: "negative" })] }));
}
function safeParseFeedgenUri(uri) {
    try {
        const urip = new AtUri(uri);
        return [urip.hostname, urip.rkey];
    }
    catch {
        return ['', ''];
    }
}
function detectKnownError(feedDesc, error) {
    if (!error) {
        return undefined;
    }
    if (error instanceof AppBskyFeedGetAuthorFeed.BlockedActorError ||
        error instanceof AppBskyFeedGetAuthorFeed.BlockedByActorError) {
        return KnownError.Block;
    }
    // check status codes
    if (error?.status === 429) {
        return KnownError.FeedTooManyRequests;
    }
    // convert error to string and continue
    if (typeof error !== 'string') {
        error = error.toString();
    }
    if (error.includes(KnownError.FeedSignedInOnly)) {
        return KnownError.FeedSignedInOnly;
    }
    if (!feedDesc.startsWith('feedgen')) {
        return KnownError.Unknown;
    }
    if (error.includes('could not find feed')) {
        return KnownError.FeedgenDoesNotExist;
    }
    if (error.includes('feed unavailable')) {
        return KnownError.FeedgenOffline;
    }
    if (error.includes('invalid did document')) {
        return KnownError.FeedgenMisconfigured;
    }
    if (error.includes('could not resolve did document')) {
        return KnownError.FeedgenMisconfigured;
    }
    if (error.includes('invalid feed generator service details in did document')) {
        return KnownError.FeedgenMisconfigured;
    }
    if (error.includes('invalid response')) {
        return KnownError.FeedgenBadResponse;
    }
    return KnownError.FeedgenUnknown;
}
//# sourceMappingURL=PostFeedErrorMessage.js.map