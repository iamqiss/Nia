import { type ModerationUI } from '@atproto/api';
import { type PickerImage } from '#/lib/media/picker.shared';
export declare function UserBanner({ type, banner, moderation, onSelectNewBanner, }: {
    type?: 'labeler' | 'default';
    banner?: string | null;
    moderation?: ModerationUI;
    onSelectNewBanner?: (img: PickerImage | null) => void;
}): any;
//# sourceMappingURL=UserBanner.d.ts.map