import {} from '@atproto/api';
import { t } from '@lingui/macro';
import { useMutation, useQuery, useQueryClient, } from '@tanstack/react-query';
import { logger } from '#/logger';
import { useAgent } from '#/state/session';
import * as Toast from '#/view/com/util/Toast';
const RQKEY_ROOT = 'notification-settings';
const RQKEY = [RQKEY_ROOT];
export function useNotificationSettingsQuery({ enabled, } = {}) {
    const agent = useAgent();
    return useQuery({
        queryKey: RQKEY,
        queryFn: async () => {
            const response = await agent.app.bsky.notification.getPreferences();
            return response.data.preferences;
        },
        enabled,
    });
}
export function useNotificationSettingsUpdateMutation() {
    const agent = useAgent();
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (update) => {
            const response = await agent.app.bsky.notification.putPreferencesV2(update);
            return response.data.preferences;
        },
        onMutate: update => {
            optimisticUpdateNotificationSettings(queryClient, update);
        },
        onError: e => {
            logger.error('Could not update notification settings', { message: e });
            queryClient.invalidateQueries({ queryKey: RQKEY });
            Toast.show(t `Could not update notification settings`, 'xmark');
        },
    });
}
function optimisticUpdateNotificationSettings(queryClient, update) {
    queryClient.setQueryData(RQKEY, (old) => {
        if (!old)
            return old;
        return { ...old, ...update };
    });
}
//# sourceMappingURL=settings.js.map