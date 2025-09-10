import { type StyleProp, type TextStyle } from 'react-native';
import { type AppBskyActorGetProfile } from '@atproto/api';
export declare function UserInfoText({ did, attr, failed, prefix, style, }: {
    did: string;
    attr?: keyof AppBskyActorGetProfile.OutputSchema;
    loading?: string;
    failed?: string;
    prefix?: string;
    style?: StyleProp<TextStyle>;
}): any;
//# sourceMappingURL=UserInfoText.d.ts.map