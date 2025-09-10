import { type AvatarColor, type Emoji } from './types';
export interface Avatar {
    image?: {
        path: string;
        mime: string;
        size: number;
        width: number;
        height: number;
    };
    backgroundColor: AvatarColor;
    placeholder: Emoji;
    useCreatedAvatar: boolean;
}
export declare const useAvatar: () => any;
export declare function StepProfile(): any;
//# sourceMappingURL=index.d.ts.map