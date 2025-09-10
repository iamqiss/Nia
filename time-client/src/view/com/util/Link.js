import { jsx as _jsx } from "react/jsx-runtime";
import { memo, useCallback, useMemo } from 'react';
import { Platform, Pressable, View, } from 'react-native';
import { sanitizeUrl } from '@braintree/sanitize-url';
import { StackActions } from '@react-navigation/native';
import { useNavigationDeduped, } from '#/lib/hooks/useNavigationDeduped';
import { useOpenLink } from '#/lib/hooks/useOpenLink';
import { getTabState, TabState } from '#/lib/routes/helpers';
import { convertBskyAppUrlIfNeeded, isExternalUrl, linkRequiresWarning, } from '#/lib/strings/url-helpers';
import {} from '#/lib/ThemeContext';
import { isAndroid, isWeb } from '#/platform/detection';
import { emitSoftReset } from '#/state/events';
import { useModalControls } from '#/state/modals';
import { WebAuxClickWrapper } from '#/view/com/util/WebAuxClickWrapper';
import { useTheme } from '#/alf';
import { useGlobalDialogsControlContext } from '#/components/dialogs/Context';
import { router } from '../../../routes';
import { PressableWithHover } from './PressableWithHover';
import { Text } from './text/Text';
/**
 * @deprecated use Link from `#/components/Link.tsx` instead
 */
export const Link = memo(function Link({ testID, style, href, title, children, noFeedback, asAnchor, accessible, anchorNoUnderline, navigationAction, onBeforePress, accessibilityActions, onAccessibilityAction, dataSet: dataSetProp, ...props }) {
    const t = useTheme();
    const { closeModal } = useModalControls();
    const navigation = useNavigationDeduped();
    const anchorHref = asAnchor ? sanitizeUrl(href) : undefined;
    const openLink = useOpenLink();
    const onPress = useCallback((e) => {
        onBeforePress?.();
        if (typeof href === 'string') {
            return onPressInner(closeModal, navigation, sanitizeUrl(href), navigationAction, openLink, e);
        }
    }, [closeModal, navigation, navigationAction, href, openLink, onBeforePress]);
    const accessibilityActionsWithActivate = [
        ...(accessibilityActions || []),
        { name: 'activate', label: title },
    ];
    const dataSet = anchorNoUnderline
        ? { ...dataSetProp, noUnderline: 1 }
        : dataSetProp;
    if (noFeedback) {
        return (_jsx(WebAuxClickWrapper, { children: _jsx(Pressable, { testID: testID, onPress: onPress, accessible: accessible, accessibilityRole: "link", accessibilityActions: accessibilityActionsWithActivate, onAccessibilityAction: e => {
                    if (e.nativeEvent.actionName === 'activate') {
                        onPress();
                    }
                    else {
                        onAccessibilityAction?.(e);
                    }
                }, 
                // @ts-ignore web only -sfn
                dataSet: dataSet, ...props, android_ripple: {
                    color: t.atoms.bg_contrast_25.backgroundColor,
                }, unstable_pressDelay: isAndroid ? 90 : undefined, children: _jsx(View, { style: style, href: anchorHref, children: children ? children : _jsx(Text, { children: title || 'link' }) }) }) }));
    }
    const Com = props.hoverStyle ? PressableWithHover : Pressable;
    return (_jsx(Com, { testID: testID, style: style, onPress: onPress, accessible: accessible, accessibilityRole: "link", accessibilityLabel: props.accessibilityLabel ?? title, accessibilityHint: props.accessibilityHint, 
        // @ts-ignore web only -prf
        href: anchorHref, dataSet: dataSet, ...props, children: children ? children : _jsx(Text, { children: title || 'link' }) }));
});
/**
 * @deprecated use InlineLinkText from `#/components/Link.tsx` instead
 */
export const TextLink = memo(function TextLink({ testID, type = 'md', style, href, text, numberOfLines, lineHeight, dataSet: dataSetProp, title, onPress: onPressProp, onBeforePress, disableMismatchWarning, navigationAction, anchorNoUnderline, ...props }) {
    const navigation = useNavigationDeduped();
    const { closeModal } = useModalControls();
    const { linkWarningDialogControl } = useGlobalDialogsControlContext();
    const openLink = useOpenLink();
    if (!disableMismatchWarning && typeof text !== 'string') {
        console.error('Unable to detect mismatching label');
    }
    const dataSet = anchorNoUnderline
        ? { ...dataSetProp, noUnderline: 1 }
        : dataSetProp;
    const onPress = useCallback((e) => {
        const requiresWarning = !disableMismatchWarning &&
            linkRequiresWarning(href, typeof text === 'string' ? text : '');
        if (requiresWarning) {
            e?.preventDefault?.();
            linkWarningDialogControl.open({
                displayText: typeof text === 'string' ? text : '',
                href,
            });
        }
        if (isWeb &&
            href !== '#' &&
            e != null &&
            isModifiedEvent(e)) {
            // Let the browser handle opening in new tab etc.
            return;
        }
        onBeforePress?.();
        if (onPressProp) {
            e?.preventDefault?.();
            // @ts-expect-error function signature differs by platform -prf
            return onPressProp();
        }
        return onPressInner(closeModal, navigation, sanitizeUrl(href), navigationAction, openLink, e);
    }, [
        onBeforePress,
        onPressProp,
        closeModal,
        navigation,
        href,
        text,
        disableMismatchWarning,
        navigationAction,
        openLink,
        linkWarningDialogControl,
    ]);
    const hrefAttrs = useMemo(() => {
        const isExternal = isExternalUrl(href);
        if (isExternal) {
            return {
                target: '_blank',
                // rel: 'noopener noreferrer',
            };
        }
        return {};
    }, [href]);
    return (_jsx(Text, { testID: testID, type: type, style: style, numberOfLines: numberOfLines, lineHeight: lineHeight, dataSet: dataSet, title: title, 
        // @ts-ignore web only -prf
        hrefAttrs: hrefAttrs, onPress: onPress, accessibilityRole: "link", href: convertBskyAppUrlIfNeeded(sanitizeUrl(href)), ...props, children: text }));
});
/**
 * @deprecated use WebOnlyInlineLinkText from `#/components/Link.tsx` instead
 */
export const TextLinkOnWebOnly = memo(function DesktopWebTextLink({ testID, type = 'md', style, href, text, numberOfLines, lineHeight, navigationAction, disableMismatchWarning, onBeforePress, ...props }) {
    if (isWeb) {
        return (_jsx(TextLink, { testID: testID, type: type, style: style, href: href, text: text, numberOfLines: numberOfLines, lineHeight: lineHeight, title: props.title, navigationAction: navigationAction, disableMismatchWarning: disableMismatchWarning, onBeforePress: onBeforePress, ...props }));
    }
    return (_jsx(Text, { testID: testID, type: type, style: style, numberOfLines: numberOfLines, lineHeight: lineHeight, title: props.title, ...props, children: text }));
});
const EXEMPT_PATHS = ['/robots.txt', '/security.txt', '/.well-known/'];
// NOTE
// we can't use the onPress given by useLinkProps because it will
// match most paths to the HomeTab routes while we actually want to
// preserve the tab the app is currently in
//
// we also have some additional behaviors - closing the current modal,
// converting bsky urls, and opening http/s links in the system browser
//
// this method copies from the onPress implementation but adds our
// needed customizations
// -prf
function onPressInner(closeModal = () => { }, navigation, href, navigationAction = 'push', openLink, e) {
    let shouldHandle = false;
    const isLeftClick = 
    // @ts-ignore Web only -prf
    Platform.OS === 'web' && (e.button == null || e.button === 0);
    // @ts-ignore Web only -prf
    const isMiddleClick = Platform.OS === 'web' && e.button === 1;
    const isMetaKey = 
    // @ts-ignore Web only -prf
    Platform.OS === 'web' && (e.metaKey || e.altKey || e.ctrlKey || e.shiftKey);
    const newTab = isMetaKey || isMiddleClick;
    if (Platform.OS !== 'web' || !e) {
        shouldHandle = e ? !e.defaultPrevented : true;
    }
    else if (!e.defaultPrevented && // onPress prevented default
        (isLeftClick || isMiddleClick) && // ignore everything but left and middle clicks
        // @ts-ignore Web only -prf
        [undefined, null, '', 'self'].includes(e.currentTarget?.target) // let browser handle "target=_blank" etc.
    ) {
        e.preventDefault();
        shouldHandle = true;
    }
    if (shouldHandle) {
        href = convertBskyAppUrlIfNeeded(href);
        if (newTab ||
            href.startsWith('http') ||
            href.startsWith('mailto') ||
            EXEMPT_PATHS.some(path => href.startsWith(path))) {
            openLink(href);
        }
        else {
            closeModal(); // close any active modals
            const [routeName, params] = router.matchPath(href);
            if (navigationAction === 'push') {
                // @ts-ignore we're not able to type check on this one -prf
                navigation.dispatch(StackActions.push(routeName, params));
            }
            else if (navigationAction === 'replace') {
                // @ts-ignore we're not able to type check on this one -prf
                navigation.dispatch(StackActions.replace(routeName, params));
            }
            else if (navigationAction === 'navigate') {
                const state = navigation.getState();
                const tabState = getTabState(state, routeName);
                if (tabState === TabState.InsideAtRoot) {
                    emitSoftReset();
                }
                else {
                    // note: 'navigate' actually acts the same as 'push' nowadays
                    // therefore we need to add 'pop' -sfn
                    // @ts-ignore we're not able to type check on this one -prf
                    navigation.navigate(routeName, params, { pop: true });
                }
            }
            else {
                throw Error('Unsupported navigator action.');
            }
        }
    }
}
function isModifiedEvent(e) {
    const eventTarget = e.currentTarget;
    const target = eventTarget.getAttribute('target');
    return ((target && target !== '_self') ||
        e.metaKey ||
        e.ctrlKey ||
        e.shiftKey ||
        e.altKey ||
        (e.nativeEvent && e.nativeEvent.which === 2));
}
//# sourceMappingURL=Link.js.map