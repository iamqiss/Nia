import { type AppBskyLabelerDefs, type ModerationOpts } from '@atproto/api';
import { type ListRef } from '#/view/com/util/List';
import { type SectionRef } from './types';
interface LabelsSectionProps {
    ref: React.Ref<SectionRef>;
    isLabelerLoading: boolean;
    labelerInfo: AppBskyLabelerDefs.LabelerViewDetailed | undefined;
    labelerError: Error | null;
    moderationOpts: ModerationOpts;
    scrollElRef: ListRef;
    headerHeight: number;
    isFocused: boolean;
    setScrollViewTag: (tag: number | null) => void;
}
export declare function ProfileLabelsSection({ ref, isLabelerLoading, labelerInfo, labelerError, moderationOpts, scrollElRef, headerHeight, isFocused, setScrollViewTag, }: LabelsSectionProps): any;
export declare function LabelerListHeader({ isLabelerLoading, labelerError, labelerInfo, hasValues, isSubscribed, }: {
    isLabelerLoading: boolean;
    labelerError?: Error | null;
    labelerInfo?: AppBskyLabelerDefs.LabelerViewDetailed;
    hasValues: boolean;
    isSubscribed: boolean;
}): any;
export {};
//# sourceMappingURL=Labels.d.ts.map