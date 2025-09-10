import { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import {} from '#/lib/routes/types';
import { bskyTitle } from '#/lib/strings/headings';
import { useUnreadNotifications } from '#/state/queries/notifications/unread';
export function useSetTitle(title) {
    const navigation = useNavigation();
    const numUnread = useUnreadNotifications();
    useEffect(() => {
        if (title) {
            navigation.setOptions({ title: bskyTitle(title, numUnread) });
        }
    }, [title, navigation, numUnread]);
}
//# sourceMappingURL=useSetTitle.js.map