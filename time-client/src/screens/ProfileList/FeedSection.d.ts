import { type FeedDescriptor } from '#/state/queries/post-feed';
import { type ListRef } from '#/view/com/util/List';
interface SectionRef {
    scrollToTop: () => void;
}
interface FeedSectionProps {
    ref?: React.Ref<SectionRef>;
    feed: FeedDescriptor;
    headerHeight: number;
    scrollElRef: ListRef;
    isFocused: boolean;
    isOwner: boolean;
    onPressAddUser: () => void;
}
export declare function FeedSection({ ref, feed, scrollElRef, headerHeight, isFocused, isOwner, onPressAddUser, }: FeedSectionProps): any;
export {};
//# sourceMappingURL=FeedSection.d.ts.map