import React from 'react';
import { type GestureResponderEvent } from 'react-native';
import { type LinkProps as RNLinkProps } from '@react-navigation/native';
import { type AllNavigatorParams } from '#/lib/routes/types';
import { type TextStyleProp } from '#/alf';
import { type ButtonProps } from '#/components/Button';
import { type TextProps } from '#/components/Typography';
/**
 * Only available within a `Link`, since that inherits from `Button`.
 * `InlineLink` provides no context.
 */
export { useButtonContext as useLinkContext } from '#/components/Button';
type BaseLinkProps = {
    testID?: string;
    to: RNLinkProps<AllNavigatorParams> | string;
    /**
     * The React Navigation `StackAction` to perform when the link is pressed.
     */
    action?: 'push' | 'replace' | 'navigate';
    /**
     * If true, will warn the user if the link text does not match the href.
     *
     * Note: atm this only works for `InlineLink`s with a string child.
     */
    disableMismatchWarning?: boolean;
    /**
     * Callback for when the link is pressed. Prevent default and return `false`
     * to exit early and prevent navigation.
     *
     * DO NOT use this for navigation, that's what the `to` prop is for.
     */
    onPress?: (e: GestureResponderEvent) => void | false;
    /**
     * Callback for when the link is long pressed (on native). Prevent default
     * and return `false` to exit early and prevent default long press hander.
     */
    onLongPress?: (e: GestureResponderEvent) => void | false;
    /**
     * Web-only attribute. Sets `download` attr on web.
     */
    download?: string;
    /**
     * Native-only attribute. If true, will open the share sheet on long press.
     */
    shareOnLongPress?: boolean;
    /**
     * Whether the link should be opened through the redirect proxy.
     */
    shouldProxy?: boolean;
};
export declare function useLink({ to, displayText, action, disableMismatchWarning, onPress: outerOnPress, onLongPress: outerOnLongPress, shareOnLongPress, overridePresentation, shouldProxy, }: BaseLinkProps & {
    displayText: string;
    overridePresentation?: boolean;
    shouldProxy?: boolean;
}): {
    isExternal: any;
    href: any;
    onPress: any;
    onLongPress: any;
};
export type LinkProps = Omit<BaseLinkProps, 'disableMismatchWarning'> & Omit<ButtonProps, 'onPress' | 'disabled'> & {
    overridePresentation?: boolean;
};
/**
 * A interactive element that renders as a `<a>` tag on the web. On mobile it
 * will translate the `href` to navigator screens and params and dispatch a
 * navigation action.
 *
 * Intended to behave as a web anchor tag. For more complex routing, use a
 * `Button`.
 */
export declare function Link({ children, to, action, onPress: outerOnPress, onLongPress: outerOnLongPress, download, shouldProxy, overridePresentation, ...rest }: LinkProps): any;
export type InlineLinkProps = React.PropsWithChildren<BaseLinkProps & TextStyleProp & Pick<TextProps, 'selectable' | 'numberOfLines' | 'emoji'> & Pick<ButtonProps, 'label' | 'accessibilityHint'> & {
    disableUnderline?: boolean;
    title?: TextProps['title'];
    overridePresentation?: boolean;
}>;
export declare function InlineLinkText({ children, to, action, disableMismatchWarning, style, onPress: outerOnPress, onLongPress: outerOnLongPress, download, selectable, label, shareOnLongPress, disableUnderline, overridePresentation, shouldProxy, ...rest }: InlineLinkProps): any;
/**
 * A barebones version of `InlineLinkText`, for use outside a
 * `react-navigation` context.
 */
export declare function SimpleInlineLinkText({ children, to, style, download, selectable, label, disableUnderline, shouldProxy, ...rest }: Omit<InlineLinkProps, 'to' | 'action' | 'disableMismatchWarning' | 'overridePresentation' | 'onPress' | 'onLongPress' | 'shareOnLongPress'> & {
    to: string;
}): any;
export declare function WebOnlyInlineLinkText({ children, to, onPress, ...props }: Omit<InlineLinkProps, 'onLongPress'>): any;
/**
 * Utility to create a static `onPress` handler for a `Link` that would otherwise link to a URI
 *
 * Example:
 *   `<Link {...createStaticClick(e => {...})} />`
 */
export declare function createStaticClick(onPressHandler: Exclude<BaseLinkProps['onPress'], undefined>): {
    to: BaseLinkProps['to'];
    onPress: Exclude<BaseLinkProps['onPress'], undefined>;
};
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
export declare function createStaticClickIfUnmodified(onPressHandler: Exclude<BaseLinkProps['onPress'], undefined>): {
    onPress: Exclude<BaseLinkProps['onPress'], undefined>;
};
/**
 * Determines if the click event has a meta key pressed, indicating the user
 * intends to deviate from default behavior.
 */
export declare function isClickEventWithMetaKey(e: GestureResponderEvent): boolean;
/**
 * Determines if the web click target is anything other than `_self`
 */
export declare function isClickTargetExternal(e: GestureResponderEvent): boolean | "";
/**
 * Determines if a click event has been modified in some way from its default
 * behavior, e.g. `Cmd` or a middle click.
 * {@link https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/button}
 */
export declare function isModifiedClickEvent(e: GestureResponderEvent): boolean;
/**
 * Determines if a click event has been modified in a way that should indiciate
 * that the user intends to open a new tab.
 * {@link https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/button}
 */
export declare function shouldClickOpenNewTab(e: GestureResponderEvent): any;
//# sourceMappingURL=Link.d.ts.map