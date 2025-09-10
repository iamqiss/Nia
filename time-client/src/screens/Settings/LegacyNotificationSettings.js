import { useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import {} from '#/lib/routes/types';
export function LegacyNotificationSettingsScreen({ navigation }) {
    useFocusEffect(useCallback(() => {
        navigation.replace('NotificationSettings');
    }, [navigation]));
    return null;
}
//# sourceMappingURL=LegacyNotificationSettings.js.map