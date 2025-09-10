import { type Position } from './@types';
export type TransformMatrix = [
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number
];
export declare function createTransform(): TransformMatrix;
export declare function applyRounding(t: TransformMatrix): void;
export declare function readTransform(t: TransformMatrix): [number, number, number];
export declare function prependTranslate(t: TransformMatrix, x: number, y: number): void;
export declare function prependScale(t: TransformMatrix, value: number): void;
export declare function prependTransform(ta: TransformMatrix, tb: TransformMatrix): void;
export declare function prependPan(t: TransformMatrix, translation: Position): void;
export declare function prependPinch(t: TransformMatrix, scale: number, origin: Position, translation: Position): void;
//# sourceMappingURL=transforms.d.ts.map