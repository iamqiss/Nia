import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useCallback, useMemo, useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, ScrollView, StyleSheet, TextInput, TouchableOpacity, View, } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { RichText as RichTextAPI } from '@atproto/api';
import { msg, Trans } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { usePalette } from '#/lib/hooks/usePalette';
import { useWebMediaQueries } from '#/lib/hooks/useWebMediaQueries';
import { cleanError, isNetworkError } from '#/lib/strings/errors';
import { enforceLen } from '#/lib/strings/helpers';
import { richTextToString } from '#/lib/strings/rich-text-helpers';
import { shortenLinks, stripInvalidMentions } from '#/lib/strings/rich-text-manip';
import { colors, gradients, s } from '#/lib/styles';
import { useTheme } from '#/lib/ThemeContext';
import {} from '#/state/gallery';
import { useModalControls } from '#/state/modals';
import { useListCreateMutation, useListMetadataMutation, } from '#/state/queries/list';
import { useAgent } from '#/state/session';
import { ErrorMessage } from '#/view/com/util/error/ErrorMessage';
import { Text } from '#/view/com/util/text/Text';
import * as Toast from '#/view/com/util/Toast';
import { EditableUserAvatar } from '#/view/com/util/UserAvatar';
const MAX_NAME = 64; // todo
const MAX_DESCRIPTION = 300; // todo
export const snapPoints = ['fullscreen'];
export function Component({ purpose, onSave, list, }) {
    const { closeModal } = useModalControls();
    const { isMobile } = useWebMediaQueries();
    const [error, setError] = useState('');
    const pal = usePalette('default');
    const theme = useTheme();
    const { _ } = useLingui();
    const listCreateMutation = useListCreateMutation();
    const listMetadataMutation = useListMetadataMutation();
    const agent = useAgent();
    const activePurpose = useMemo(() => {
        if (list?.purpose) {
            return list.purpose;
        }
        if (purpose) {
            return purpose;
        }
        return 'app.bsky.graph.defs#curatelist';
    }, [list, purpose]);
    const isCurateList = activePurpose === 'app.bsky.graph.defs#curatelist';
    const [isProcessing, setProcessing] = useState(false);
    const [name, setName] = useState(list?.name || '');
    const [descriptionRt, setDescriptionRt] = useState(() => {
        const text = list?.description;
        const facets = list?.descriptionFacets;
        if (!text || !facets) {
            return new RichTextAPI({ text: text || '' });
        }
        // We want to be working with a blank state here, so let's get the
        // serialized version and turn it back into a RichText
        const serialized = richTextToString(new RichTextAPI({ text, facets }), false);
        const richText = new RichTextAPI({ text: serialized });
        richText.detectFacetsWithoutResolution();
        return richText;
    });
    const graphemeLength = useMemo(() => {
        return shortenLinks(descriptionRt).graphemeLength;
    }, [descriptionRt]);
    const isDescriptionOver = graphemeLength > MAX_DESCRIPTION;
    const [avatar, setAvatar] = useState(list?.avatar);
    const [newAvatar, setNewAvatar] = useState();
    const onDescriptionChange = useCallback((newText) => {
        const richText = new RichTextAPI({ text: newText });
        richText.detectFacetsWithoutResolution();
        setDescriptionRt(richText);
    }, [setDescriptionRt]);
    const onPressCancel = useCallback(() => {
        closeModal();
    }, [closeModal]);
    const onSelectNewAvatar = useCallback((img) => {
        if (!img) {
            setNewAvatar(null);
            setAvatar(undefined);
            return;
        }
        try {
            setNewAvatar(img);
            setAvatar(img.path);
        }
        catch (e) {
            setError(cleanError(e));
        }
    }, [setNewAvatar, setAvatar, setError]);
    const onPressSave = useCallback(async () => {
        const nameTrimmed = name.trim();
        if (!nameTrimmed) {
            setError(_(msg `Name is required`));
            return;
        }
        setProcessing(true);
        if (error) {
            setError('');
        }
        try {
            let richText = new RichTextAPI({ text: descriptionRt.text.trimEnd() }, { cleanNewlines: true });
            await richText.detectFacets(agent);
            richText = shortenLinks(richText);
            richText = stripInvalidMentions(richText);
            if (list) {
                await listMetadataMutation.mutateAsync({
                    uri: list.uri,
                    name: nameTrimmed,
                    description: richText.text,
                    descriptionFacets: richText.facets,
                    avatar: newAvatar,
                });
                Toast.show(isCurateList
                    ? _(msg({ message: 'User list updated', context: 'toast' }))
                    : _(msg({ message: 'Moderation list updated', context: 'toast' })));
                onSave?.(list.uri);
            }
            else {
                const res = await listCreateMutation.mutateAsync({
                    purpose: activePurpose,
                    name,
                    description: richText.text,
                    descriptionFacets: richText.facets,
                    avatar: newAvatar,
                });
                Toast.show(isCurateList
                    ? _(msg({ message: 'User list created', context: 'toast' }))
                    : _(msg({ message: 'Moderation list created', context: 'toast' })));
                onSave?.(res.uri);
            }
            closeModal();
        }
        catch (e) {
            if (isNetworkError(e)) {
                setError(_(msg `Failed to create the list. Check your internet connection and try again.`));
            }
            else {
                setError(cleanError(e));
            }
        }
        setProcessing(false);
    }, [
        setProcessing,
        setError,
        error,
        onSave,
        closeModal,
        activePurpose,
        isCurateList,
        name,
        descriptionRt,
        newAvatar,
        list,
        listMetadataMutation,
        listCreateMutation,
        _,
        agent,
    ]);
    return (_jsx(KeyboardAvoidingView, { behavior: "height", children: _jsxs(ScrollView, { style: [
                pal.view,
                {
                    paddingHorizontal: isMobile ? 16 : 0,
                },
            ], testID: "createOrEditListModal", children: [_jsx(Text, { style: [styles.title, pal.text], children: isCurateList ? (list ? (_jsx(Trans, { children: "Edit User List" })) : (_jsx(Trans, { children: "New User List" }))) : list ? (_jsx(Trans, { children: "Edit Moderation List" })) : (_jsx(Trans, { children: "New Moderation List" })) }), error !== '' && (_jsx(View, { style: styles.errorContainer, children: _jsx(ErrorMessage, { message: error }) })), _jsx(Text, { style: [styles.label, pal.text], children: _jsx(Trans, { children: "List Avatar" }) }), _jsx(View, { style: [styles.avi, { borderColor: pal.colors.background }], children: _jsx(EditableUserAvatar, { type: "list", size: 80, avatar: avatar, onSelectNewAvatar: onSelectNewAvatar }) }), _jsxs(View, { style: styles.form, children: [_jsxs(View, { children: [_jsx(View, { style: styles.labelWrapper, children: _jsx(Text, { style: [styles.label, pal.text], nativeID: "list-name", children: _jsx(Trans, { children: "List Name" }) }) }), _jsx(TextInput, { testID: "editNameInput", style: [styles.textInput, pal.border, pal.text], placeholder: isCurateList
                                        ? _(msg `e.g. Great Posters`)
                                        : _(msg `e.g. Spammers`), placeholderTextColor: colors.gray4, value: name, onChangeText: v => setName(enforceLen(v, MAX_NAME)), accessible: true, accessibilityLabel: _(msg `Name`), accessibilityHint: "", accessibilityLabelledBy: "list-name" })] }), _jsxs(View, { style: s.pb10, children: [_jsxs(View, { style: styles.labelWrapper, children: [_jsx(Text, { style: [styles.label, pal.text], nativeID: "list-description", children: _jsx(Trans, { children: "Description" }) }), _jsxs(Text, { style: [!isDescriptionOver ? pal.textLight : s.red3, s.f13], children: [graphemeLength, "/", MAX_DESCRIPTION] })] }), _jsx(TextInput, { testID: "editDescriptionInput", style: [styles.textArea, pal.border, pal.text], placeholder: isCurateList
                                        ? _(msg `e.g. The posters who never miss.`)
                                        : _(msg `e.g. Users that repeatedly reply with ads.`), placeholderTextColor: colors.gray4, keyboardAppearance: theme.colorScheme, multiline: true, value: descriptionRt.text, onChangeText: onDescriptionChange, accessible: true, accessibilityLabel: _(msg `Description`), accessibilityHint: "", accessibilityLabelledBy: "list-description" })] }), isProcessing ? (_jsx(View, { style: [styles.btn, s.mt10, { backgroundColor: colors.gray2 }], children: _jsx(ActivityIndicator, {}) })) : (_jsx(TouchableOpacity, { testID: "saveBtn", style: [s.mt10, isDescriptionOver && s.dimmed], disabled: isDescriptionOver, onPress: onPressSave, accessibilityRole: "button", accessibilityLabel: _(msg `Save`), accessibilityHint: "", children: _jsx(LinearGradient, { colors: [gradients.blueLight.start, gradients.blueLight.end], start: { x: 0, y: 0 }, end: { x: 1, y: 1 }, style: styles.btn, children: _jsx(Text, { style: [s.white, s.bold], children: _jsx(Trans, { context: "action", children: "Save" }) }) }) })), _jsx(TouchableOpacity, { testID: "cancelBtn", style: s.mt5, onPress: onPressCancel, accessibilityRole: "button", accessibilityLabel: _(msg `Cancel`), accessibilityHint: "", onAccessibilityEscape: onPressCancel, children: _jsx(View, { style: [styles.btn], children: _jsx(Text, { style: [s.black, s.bold, pal.text], children: _jsx(Trans, { context: "action", children: "Cancel" }) }) }) })] })] }) }));
}
const styles = StyleSheet.create({
    title: {
        textAlign: 'center',
        fontWeight: '600',
        fontSize: 24,
        marginBottom: 18,
    },
    labelWrapper: {
        flexDirection: 'row',
        gap: 8,
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 4,
        paddingBottom: 4,
        marginTop: 20,
    },
    label: {
        fontWeight: '600',
    },
    form: {
        paddingHorizontal: 6,
    },
    textInput: {
        borderWidth: 1,
        borderRadius: 6,
        paddingHorizontal: 14,
        paddingVertical: 10,
        fontSize: 16,
    },
    textArea: {
        borderWidth: 1,
        borderRadius: 6,
        paddingHorizontal: 12,
        paddingTop: 10,
        fontSize: 16,
        height: 100,
        textAlignVertical: 'top',
    },
    btn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        borderRadius: 32,
        padding: 10,
        marginBottom: 10,
    },
    avi: {
        width: 84,
        height: 84,
        borderWidth: 2,
        borderRadius: 42,
        marginTop: 4,
    },
    errorContainer: { marginTop: 20 },
});
//# sourceMappingURL=CreateOrEditList.js.map