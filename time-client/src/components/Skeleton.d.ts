import { type ReactNode } from 'react';
import { type TextStyleProp, type ViewStyleProp } from '#/alf';
type SkeletonProps = {
    blend?: boolean;
};
export declare function Text({ blend, style }: TextStyleProp & SkeletonProps): any;
export declare function Circle({ children, size, blend, style, }: ViewStyleProp & {
    children?: ReactNode;
    size: number;
} & SkeletonProps): any;
export declare function Pill({ size, blend, style, }: ViewStyleProp & {
    size: number;
} & SkeletonProps): any;
export declare function Col({ children, style, }: ViewStyleProp & {
    children?: React.ReactNode;
}): any;
export declare function Row({ children, style, }: ViewStyleProp & {
    children?: React.ReactNode;
}): any;
export {};
//# sourceMappingURL=Skeleton.d.ts.map