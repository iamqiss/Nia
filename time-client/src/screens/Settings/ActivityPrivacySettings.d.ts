import { type AppBskyNotificationDeclaration } from '@atproto/api';
import { type AllNavigatorParams, type NativeStackScreenProps } from '#/lib/routes/types';
type Props = NativeStackScreenProps<AllNavigatorParams, 'ActivityPrivacySettings'>;
export declare function ActivityPrivacySettingsScreen({}: Props): any;
export declare function Inner({ notificationDeclaration, }: {
    notificationDeclaration: {
        uri?: string;
        cid?: string;
        value: AppBskyNotificationDeclaration.Record;
    };
}): any;
export {};
//# sourceMappingURL=ActivityPrivacySettings.d.ts.map