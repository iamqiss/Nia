import { type AppBskyGraphDefs } from '@atproto/api';
import { type ListRef } from '#/view/com/util/List';
interface SectionRef {
    scrollToTop: () => void;
}
interface AboutSectionProps {
    ref?: React.Ref<SectionRef>;
    list: AppBskyGraphDefs.ListView;
    onPressAddUser: () => void;
    headerHeight: number;
    scrollElRef: ListRef;
}
export declare function AboutSection({ ref, list, onPressAddUser, headerHeight, scrollElRef, }: AboutSectionProps): any;
export {};
//# sourceMappingURL=AboutSection.d.ts.map