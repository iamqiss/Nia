import { type Gif } from '#/state/queries/tenor';
export declare function GifSelectDialog({ controlRef, onClose, onSelectGif: onSelectGifProp, }: {
    controlRef: React.RefObject<{
        open: () => void;
    } | null>;
    onClose?: () => void;
    onSelectGif: (gif: Gif) => void;
}): any;
export declare function GifPreview({ gif, onSelectGif, }: {
    gif: Gif;
    onSelectGif: (gif: Gif) => void;
}): any;
//# sourceMappingURL=GifSelect.d.ts.map