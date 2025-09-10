import { jsx as _jsx } from "react/jsx-runtime";
import React from 'react';
import {} from '@atproto/api';
import { msg } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { useQueryClient } from '@tanstack/react-query';
import { useNonReactiveCallback } from '#/lib/hooks/useNonReactiveCallback';
import { postUriToRelativePath, toBskyAppUrl } from '#/lib/strings/url-helpers';
import { purgeTemporaryImageFiles } from '#/state/gallery';
import { precacheResolveLinkQuery } from '#/state/queries/resolve-link';
import {} from '#/view/com/composer/text-input/web/EmojiPicker';
import * as Toast from '#/view/com/util/Toast';
const stateContext = React.createContext(undefined);
stateContext.displayName = 'ComposerStateContext';
const controlsContext = React.createContext({
    openComposer(_opts) { },
    closeComposer() {
        return false;
    },
});
controlsContext.displayName = 'ComposerControlsContext';
export function Provider({ children }) {
    const { _ } = useLingui();
    const [state, setState] = React.useState();
    const queryClient = useQueryClient();
    const openComposer = useNonReactiveCallback((opts) => {
        if (opts.quote) {
            const path = postUriToRelativePath(opts.quote.uri);
            if (path) {
                const appUrl = toBskyAppUrl(path);
                precacheResolveLinkQuery(queryClient, appUrl, {
                    type: 'record',
                    kind: 'post',
                    record: {
                        cid: opts.quote.cid,
                        uri: opts.quote.uri,
                    },
                    view: opts.quote,
                });
            }
        }
        const author = opts.replyTo?.author || opts.quote?.author;
        const isBlocked = Boolean(author &&
            (author.viewer?.blocking ||
                author.viewer?.blockedBy ||
                author.viewer?.blockingByList));
        if (isBlocked) {
            Toast.show(_(msg `Cannot interact with a blocked user`), 'exclamation-circle');
        }
        else {
            setState(prevOpts => {
                if (prevOpts) {
                    // Never replace an already open composer.
                    return prevOpts;
                }
                return opts;
            });
        }
    });
    const closeComposer = useNonReactiveCallback(() => {
        let wasOpen = !!state;
        if (wasOpen) {
            setState(undefined);
            purgeTemporaryImageFiles();
        }
        return wasOpen;
    });
    const api = React.useMemo(() => ({
        openComposer,
        closeComposer,
    }), [openComposer, closeComposer]);
    return (_jsx(stateContext.Provider, { value: state, children: _jsx(controlsContext.Provider, { value: api, children: children }) }));
}
export function useComposerState() {
    return React.useContext(stateContext);
}
export function useComposerControls() {
    const { closeComposer } = React.useContext(controlsContext);
    return React.useMemo(() => ({ closeComposer }), [closeComposer]);
}
/**
 * DO NOT USE DIRECTLY. The deprecation notice as a warning only, it's not
 * actually deprecated.
 *
 * @deprecated use `#/lib/hooks/useOpenComposer` instead
 */
export function useOpenComposer() {
    const { openComposer } = React.useContext(controlsContext);
    return React.useMemo(() => ({ openComposer }), [openComposer]);
}
//# sourceMappingURL=index.js.map