import { jsx as _jsx } from "react/jsx-runtime";
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import {} from '#/lib/routes/types';
import {} from '#/state/queries/feed';
import { useSession } from '#/state/session';
import {} from '#/view/com/pager/Pager';
import { TabBar } from '../pager/TabBar';
import { HomeHeaderLayout } from './HomeHeaderLayout';
export function HomeHeader(props) {
    const { feeds, onSelect: onSelectProp } = props;
    const { hasSession } = useSession();
    const navigation = useNavigation();
    const hasPinnedCustom = React.useMemo(() => {
        if (!hasSession)
            return false;
        return feeds.some(tab => {
            const isFollowing = tab.uri === 'following';
            return !isFollowing;
        });
    }, [feeds, hasSession]);
    const items = React.useMemo(() => {
        const pinnedNames = feeds.map(f => f.displayName);
        if (!hasPinnedCustom) {
            return pinnedNames.concat('Feeds ✨');
        }
        return pinnedNames;
    }, [hasPinnedCustom, feeds]);
    const onPressFeedsLink = React.useCallback(() => {
        navigation.navigate('Feeds');
    }, [navigation]);
    const onSelect = React.useCallback((index) => {
        if (!hasPinnedCustom && index === items.length - 1) {
            onPressFeedsLink();
        }
        else if (onSelectProp) {
            onSelectProp(index);
        }
    }, [items.length, onPressFeedsLink, onSelectProp, hasPinnedCustom]);
    return (_jsx(HomeHeaderLayout, { tabBarAnchor: props.tabBarAnchor, children: _jsx(TabBar, { onPressSelected: props.onPressSelected, selectedPage: props.selectedPage, onSelect: onSelect, testID: props.testID, items: items, dragProgress: props.dragProgress, dragState: props.dragState }, items.join(',')) }));
}
//# sourceMappingURL=HomeHeader.js.map