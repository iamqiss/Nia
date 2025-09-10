import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useCallback, useImperativeHandle, useMemo, useRef, useState, } from 'react';
import { Text as RNText, View, } from 'react-native';
import { AppBskyRichtextFacet, RichText } from '@atproto/api';
import PasteInput, {} from '@mattermost/react-native-paste-input';
import { POST_IMG_MAX } from '#/lib/constants';
import { downloadAndResize } from '#/lib/media/manip';
import { isUriImage } from '#/lib/media/util';
import { cleanError } from '#/lib/strings/errors';
import { getMentionAt, insertMentionAt } from '#/lib/strings/mention-manip';
import { useTheme } from '#/lib/ThemeContext';
import { isAndroid, isNative } from '#/platform/detection';
import { suggestLinkCardUri, } from '#/view/com/composer/text-input/text-input-util';
import { atoms as a, useAlf } from '#/alf';
import { normalizeTextStyles } from '#/alf/typography';
import { Autocomplete } from './mobile/Autocomplete';
import {} from './TextInput.types';
export function TextInput({ ref, richtext, placeholder, hasRightPadding, setRichText, onPhotoPasted, onNewLink, onError, ...props }) {
    const { theme: t, fonts } = useAlf();
    const textInput = useRef(null);
    const textInputSelection = useRef({ start: 0, end: 0 });
    const theme = useTheme();
    const [autocompletePrefix, setAutocompletePrefix] = useState('');
    const prevLength = useRef(richtext.length);
    useImperativeHandle(ref, () => ({
        focus: () => textInput.current?.focus(),
        blur: () => {
            textInput.current?.blur();
        },
        getCursorPosition: () => undefined, // Not implemented on native
        maybeClosePopup: () => false, // Not needed on native
    }));
    const pastSuggestedUris = useRef(new Set());
    const prevDetectedUris = useRef(new Map());
    const onChangeText = useCallback(async (newText) => {
        const mayBePaste = newText.length > prevLength.current + 1;
        const newRt = new RichText({ text: newText });
        newRt.detectFacetsWithoutResolution();
        setRichText(newRt);
        // NOTE: BinaryFiddler
        // onChangeText happens before onSelectionChange, cursorPos is out of bound if the user deletes characters,
        const cursorPos = textInputSelection.current?.start ?? 0;
        const prefix = getMentionAt(newText, Math.min(cursorPos, newText.length));
        if (prefix) {
            setAutocompletePrefix(prefix.value);
        }
        else if (autocompletePrefix) {
            setAutocompletePrefix('');
        }
        const nextDetectedUris = new Map();
        if (newRt.facets) {
            for (const facet of newRt.facets) {
                for (const feature of facet.features) {
                    if (AppBskyRichtextFacet.isLink(feature)) {
                        if (isUriImage(feature.uri)) {
                            const res = await downloadAndResize({
                                uri: feature.uri,
                                width: POST_IMG_MAX.width,
                                height: POST_IMG_MAX.height,
                                mode: 'contain',
                                maxSize: POST_IMG_MAX.size,
                                timeout: 15e3,
                            });
                            if (res !== undefined) {
                                onPhotoPasted(res.path);
                            }
                        }
                        else {
                            nextDetectedUris.set(feature.uri, { facet, rt: newRt });
                        }
                    }
                }
            }
        }
        const suggestedUri = suggestLinkCardUri(mayBePaste, nextDetectedUris, prevDetectedUris.current, pastSuggestedUris.current);
        prevDetectedUris.current = nextDetectedUris;
        if (suggestedUri) {
            onNewLink(suggestedUri);
        }
        prevLength.current = newText.length;
    }, [setRichText, autocompletePrefix, onPhotoPasted, onNewLink]);
    const onPaste = useCallback(async (err, files) => {
        if (err) {
            return onError(cleanError(err));
        }
        const uris = files.map(f => f.uri);
        const uri = uris.find(isUriImage);
        if (uri) {
            onPhotoPasted(uri);
        }
    }, [onError, onPhotoPasted]);
    const onSelectionChange = useCallback((evt) => {
        // NOTE we track the input selection using a ref to avoid excessive renders -prf
        textInputSelection.current = evt.nativeEvent.selection;
    }, [textInputSelection]);
    const onSelectAutocompleteItem = useCallback((item) => {
        onChangeText(insertMentionAt(richtext.text, textInputSelection.current?.start || 0, item));
        setAutocompletePrefix('');
    }, [onChangeText, richtext, setAutocompletePrefix]);
    const inputTextStyle = useMemo(() => {
        const style = normalizeTextStyles([a.text_lg, a.leading_snug, t.atoms.text], {
            fontScale: fonts.scaleMultiplier,
            fontFamily: fonts.family,
            flags: {},
        });
        /**
         * PasteInput doesn't like `lineHeight`, results in jumpiness
         */
        if (isNative) {
            style.lineHeight = undefined;
        }
        /*
         * Android impl of `PasteInput` doesn't support the array syntax for `fontVariant`
         */
        if (isAndroid) {
            // @ts-ignore
            style.fontVariant = style.fontVariant
                ? style.fontVariant.join(' ')
                : undefined;
        }
        return style;
    }, [t, fonts]);
    const textDecorated = useMemo(() => {
        let i = 0;
        return Array.from(richtext.segments()).map(segment => {
            return (_jsx(RNText, { style: [
                    inputTextStyle,
                    {
                        color: segment.facet ? t.palette.primary_500 : t.atoms.text.color,
                        marginTop: -1,
                    },
                ], children: segment.text }, i++));
        });
    }, [t, richtext, inputTextStyle]);
    return (_jsxs(View, { style: [a.flex_1, a.pl_md, hasRightPadding && a.pr_4xl], children: [_jsx(PasteInput, { testID: "composerTextInput", ref: textInput, onChangeText: onChangeText, onPaste: onPaste, onSelectionChange: onSelectionChange, placeholder: placeholder, placeholderTextColor: t.atoms.text_contrast_medium.color, keyboardAppearance: theme.colorScheme, autoFocus: true, allowFontScaling: true, multiline: true, scrollEnabled: false, numberOfLines: 2, 
                // Note: should be the default value, but as of v1.104
                // it switched to "none" on Android
                autoCapitalize: "sentences", ...props, style: [
                    inputTextStyle,
                    a.w_full,
                    !autocompletePrefix && a.h_full,
                    {
                        textAlignVertical: 'top',
                        minHeight: 60,
                        includeFontPadding: false,
                    },
                    {
                        borderWidth: 1,
                        borderColor: 'transparent',
                    },
                    props.style,
                ], children: textDecorated }), _jsx(Autocomplete, { prefix: autocompletePrefix, onSelect: onSelectAutocompleteItem })] }));
}
//# sourceMappingURL=TextInput.js.map