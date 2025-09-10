import { type StyleProp, type ViewStyle } from 'react-native';
import { type ModerationCause, type ModerationUI } from '@atproto/api';
import * as Pills from '#/components/Pills';
export declare function PostAlerts({ modui, size, style, additionalCauses, }: {
    modui: ModerationUI;
    size?: Pills.CommonProps['size'];
    includeMute?: boolean;
    style?: StyleProp<ViewStyle>;
    additionalCauses?: ModerationCause[] | Pills.AppModerationCause[];
}): any;
//# sourceMappingURL=PostAlerts.d.ts.map