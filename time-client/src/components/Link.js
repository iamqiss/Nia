import { jsx as _jsx } from "react/jsx-runtime";
import React, { useMemo } from 'react';
import { Linking } from 'react-native';
import { sanitizeUrl } from '@braintree/sanitize-url';
import { StackActions, } from '@react-navigation/native';
import { BSKY_DOWNLOAD_URL } from '#/lib/constants';
import { useNavigationDeduped } from '#/lib/hooks/useNavigationDeduped';
import { useOpenLink } from '#/lib/hooks/useOpenLink';
import {} from '#/lib/routes/types';
import { shareUrl } from '#/lib/sharing';
import { convertBskyAppUrlIfNeeded, createProxiedUrl, isBskyDownloadUrl, isExternalUrl, linkRequiresWarning, } from '#/lib/strings/url-helpers';
import { isNative, isWeb } from '#/platform/detection';
import { useModalControls } from '#/state/modals';
import { atoms as a, flatten, useTheme, web } from '#/alf';
import { Button } from '#/components/Button';
import { useInteractionState } from '#/components/hooks/useInteractionState';
import { Text } from '#/components/Typography';
import { router } from '#/routes';
import { useGlobalDialogsControlContext } from './dialogs/Context';
/**
 * Only available within a `Link`, since that inherits from `Button`.
 * `InlineLink` provides no context.
 */
export { useButtonContext as useLinkContext } from '#/components/Button';
export function useLink({ to, displayText, action = 'push', disableMismatchWarning, onPress: outerOnPress, onLongPress: outerOnLongPress, shareOnLongPress, overridePresentation, shouldProxy, }) {
    const navigation = useNavigationDeduped();
    const href = useMemo(() => {
        return typeof to === 'string'
            ? convertBskyAppUrlIfNeeded(sanitizeUrl(to))
            : to.screen
                ? router.matchName(to.screen)?.build(to.params)
                : to.href
                    ? convertBskyAppUrlIfNeeded(sanitizeUrl(to.href))
                    : undefined;
    }, [to]);
    if (!href) {
        throw new Error('Could not resolve screen. Link `to` prop must be a string or an object with `screen` and `params` properties');
    }
    const isExternal = isExternalUrl(href);
    const { closeModal } = useModalControls();
    const { linkWarningDialogControl } = useGlobalDialogsControlContext();
    const openLink = useOpenLink();
    const onPress = React.useCallback((e) => {
        const exitEarlyIfFalse = outerOnPress?.(e);
        if (exitEarlyIfFalse === false)
            return;
        const requiresWarning = Boolean(!disableMismatchWarning &&
            displayText &&
            isExternal &&
            linkRequiresWarning(href, displayText));
        if (isWeb) {
            e.preventDefault();
        }
        if (requiresWarning) {
            linkWarningDialogControl.open({
                displayText,
                href,
            });
        }
        else {
            if (isExternal) {
                openLink(href, overridePresentation, shouldProxy);
            }
            else {
                const shouldOpenInNewTab = shouldClickOpenNewTab(e);
                if (isBskyDownloadUrl(href)) {
                    shareUrl(BSKY_DOWNLOAD_URL);
                }
                else if (shouldOpenInNewTab ||
                    href.startsWith('http') ||
                    href.startsWith('mailto')) {
                    openLink(href);
                }
                else {
                    closeModal(); // close any active modals
                    const [screen, params] = router.matchPath(href);
                    // does not apply to web's flat navigator
                    if (isNative && screen !== 'NotFound') {
                        const state = navigation.getState();
                        // if screen is not in the current navigator, it means it's
                        // most likely a tab screen
                        if (!state.routeNames.includes(screen)) {
                            const parent = navigation.getParent();
                            if (parent &&
                                parent.getState().routeNames.includes(`${screen}Tab`)) {
                                // yep, it's a tab screen. i.e. SearchTab
                                // thus we need to navigate to the child screen
                                // via the parent navigator
                                // see https://reactnavigation.org/docs/upgrading-from-6.x/#changes-to-the-navigate-action
                                // TODO: can we support the other kinds of actions? push/replace -sfn
                                // @ts-expect-error include does not narrow the type unfortunately
                                parent.navigate(`${screen}Tab`, { screen, params });
                                return;
                            }
                            else {
                                // will probably fail, but let's try anyway
                            }
                        }
                    }
                    if (action === 'push') {
                        navigation.dispatch(StackActions.push(screen, params));
                    }
                    else if (action === 'replace') {
                        navigation.dispatch(StackActions.replace(screen, params));
                    }
                    else if (action === 'navigate') {
                        // @ts-expect-error not typed
                        navigation.navigate(screen, params, { pop: true });
                    }
                    else {
                        throw Error('Unsupported navigator action.');
                    }
                }
            }
        }
    }, [
        outerOnPress,
        disableMismatchWarning,
        displayText,
        isExternal,
        href,
        openLink,
        closeModal,
        action,
        navigation,
        overridePresentation,
        shouldProxy,
        linkWarningDialogControl,
    ]);
    const handleLongPress = React.useCallback(() => {
        const requiresWarning = Boolean(!disableMismatchWarning &&
            displayText &&
            isExternal &&
            linkRequiresWarning(href, displayText));
        if (requiresWarning) {
            linkWarningDialogControl.open({
                displayText,
                href,
                share: true,
            });
        }
        else {
            shareUrl(href);
        }
    }, [
        disableMismatchWarning,
        displayText,
        href,
        isExternal,
        linkWarningDialogControl,
    ]);
    const onLongPress = React.useCallback((e) => {
        const exitEarlyIfFalse = outerOnLongPress?.(e);
        if (exitEarlyIfFalse === false)
            return;
        return isNative && shareOnLongPress ? handleLongPress() : undefined;
    }, [outerOnLongPress, handleLongPress, shareOnLongPress]);
    return {
        isExternal,
        href,
        onPress,
        onLongPress,
    };
}
/**
 * A interactive element that renders as a `<a>` tag on the web. On mobile it
 * will translate the `href` to navigator screens and params and dispatch a
 * navigation action.
 *
 * Intended to behave as a web anchor tag. For more complex routing, use a
 * `Button`.
 */
export function Link({ children, to, action = 'push', onPress: outerOnPress, onLongPress: outerOnLongPress, download, shouldProxy, overridePresentation, ...rest }) {
    const { href, isExternal, onPress, onLongPress } = useLink({
        to,
        displayText: typeof children === 'string' ? children : '',
        action,
        onPress: outerOnPress,
        onLongPress: outerOnLongPress,
        shouldProxy: shouldProxy,
        overridePresentation,
    });
    return (_jsx(Button, { ...rest, style: [a.justify_start, flatten(rest.style)], role: "link", accessibilityRole: "link", href: href, onPress: download ? undefined : onPress, onLongPress: onLongPress, ...web({
            hrefAttrs: {
                target: download ? undefined : isExternal ? 'blank' : undefined,
                rel: isExternal ? 'noopener noreferrer' : undefined,
                download,
            },
            dataSet: {
                // no underline, only `InlineLink` has underlines
                noUnderline: '1',
            },
        }), children: children }));
}
export function InlineLinkText({ children, to, action = 'push', disableMismatchWarning, style, onPress: outerOnPress, onLongPress: outerOnLongPress, download, selectable, label, shareOnLongPress, disableUnderline, overridePresentation, shouldProxy, ...rest }) {
    const t = useTheme();
    const stringChildren = typeof children === 'string';
    const { href, isExternal, onPress, onLongPress } = useLink({
        to,
        displayText: stringChildren ? children : '',
        action,
        disableMismatchWarning,
        onPress: outerOnPress,
        onLongPress: outerOnLongPress,
        shareOnLongPress,
        overridePresentation,
        shouldProxy: shouldProxy,
    });
    const { state: hovered, onIn: onHoverIn, onOut: onHoverOut, } = useInteractionState();
    const flattenedStyle = flatten(style) || {};
    return (_jsx(Text, { selectable: selectable, accessibilityHint: "", accessibilityLabel: label, ...rest, style: [
            { color: t.palette.primary_500 },
            hovered &&
                !disableUnderline && {
                ...web({
                    outline: 0,
                    textDecorationLine: 'underline',
                    textDecorationColor: flattenedStyle.color ?? t.palette.primary_500,
                }),
            },
            flattenedStyle,
        ], role: "link", onPress: download ? undefined : onPress, onLongPress: onLongPress, onMouseEnter: onHoverIn, onMouseLeave: onHoverOut, accessibilityRole: "link", href: href, ...web({
            hrefAttrs: {
                target: download ? undefined : isExternal ? 'blank' : undefined,
                rel: isExternal ? 'noopener noreferrer' : undefined,
                download,
            },
            dataSet: {
                // default to no underline, apply this ourselves
                noUnderline: '1',
            },
        }), children: children }));
}
/**
 * A barebones version of `InlineLinkText`, for use outside a
 * `react-navigation` context.
 */
export function SimpleInlineLinkText({ children, to, style, download, selectable, label, disableUnderline, shouldProxy, ...rest }) {
    const t = useTheme();
    const { state: hovered, onIn: onHoverIn, onOut: onHoverOut, } = useInteractionState();
    const flattenedStyle = flatten(style) || {};
    const isExternal = isExternalUrl(to);
    let href = to;
    if (shouldProxy) {
        href = createProxiedUrl(href);
    }
    const onPress = () => {
        Linking.openURL(href);
    };
    return (_jsx(Text, { selectable: selectable, accessibilityHint: "", accessibilityLabel: label, ...rest, style: [
            { color: t.palette.primary_500 },
            hovered &&
                !disableUnderline && {
                ...web({
                    outline: 0,
                    textDecorationLine: 'underline',
                    textDecorationColor: flattenedStyle.color ?? t.palette.primary_500,
                }),
            },
            flattenedStyle,
        ], role: "link", onPress: onPress, onMouseEnter: onHoverIn, onMouseLeave: onHoverOut, accessibilityRole: "link", href: href, ...web({
            hrefAttrs: {
                target: download ? undefined : isExternal ? 'blank' : undefined,
                rel: isExternal ? 'noopener noreferrer' : undefined,
                download,
            },
            dataSet: {
                // default to no underline, apply this ourselves
                noUnderline: '1',
            },
        }), children: children }));
}
export function WebOnlyInlineLinkText({ children, to, onPress, ...props }) {
    return isWeb ? (_jsx(InlineLinkText, { ...props, to: to, onPress: onPress, children: children })) : (_jsx(Text, { ...props, children: children }));
}
/**
 * Utility to create a static `onPress` handler for a `Link` that would otherwise link to a URI
 *
 * Example:
 *   `<Link {...createStaticClick(e => {...})} />`
 */
export function createStaticClick(onPressHandler) {
    return {
        to: '#',
        onPress(e) {
            e.preventDefault();
            onPressHandler(e);
            return false;
        },
    };
}
/**
 * Utility to create a static `onPress` handler for a `Link`, but only if the
 * click was not modified in some way e.g. `Cmd` or a middle click.
 *
 * On native, this behaves the same as `createStaticClick` because there are no
 * options to "modify" the click in this sense.
 *
 * Example:
 *   `<Link {...createStaticClick(e => {...})} />`
 */
export function createStaticClickIfUnmodified(onPressHandler) {
    return {
        onPress(e) {
            if (!isWeb || !isModifiedClickEvent(e)) {
                e.preventDefault();
                onPressHandler(e);
                return false;
            }
        },
    };
}
/**
 * Determines if the click event has a meta key pressed, indicating the user
 * intends to deviate from default behavior.
 */
export function isClickEventWithMetaKey(e) {
    if (!isWeb)
        return false;
    const event = e;
    return event.metaKey || event.altKey || event.ctrlKey || event.shiftKey;
}
/**
 * Determines if the web click target is anything other than `_self`
 */
export function isClickTargetExternal(e) {
    if (!isWeb)
        return false;
    const event = e;
    const el = event.currentTarget;
    return el && el.target && el.target !== '_self';
}
/**
 * Determines if a click event has been modified in some way from its default
 * behavior, e.g. `Cmd` or a middle click.
 * {@link https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/button}
 */
export function isModifiedClickEvent(e) {
    if (!isWeb)
        return false;
    const event = e;
    const isPrimaryButton = event.button === 0;
    return (isClickEventWithMetaKey(e) || isClickTargetExternal(e) || !isPrimaryButton);
}
/**
 * Determines if a click event has been modified in a way that should indiciate
 * that the user intends to open a new tab.
 * {@link https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/button}
 */
export function shouldClickOpenNewTab(e) {
    if (!isWeb)
        return false;
    const event = e;
    const isMiddleClick = isWeb && event.button === 1;
    return isClickEventWithMetaKey(e) || isClickTargetExternal(e) || isMiddleClick;
}
//# sourceMappingURL=Link.js.map