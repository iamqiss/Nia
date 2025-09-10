import { type EmbedPlayerParams } from '#/lib/strings/embed-player';
import { type Gif } from '#/state/queries/tenor';
export declare function GifAltTextDialog({ gif, altText, onSubmit, }: {
    gif: Gif;
    altText: string;
    onSubmit: (alt: string) => void;
}): any;
export declare function GifAltTextDialogLoaded({ vendorAltText, altText, onSubmit, params, thumb, }: {
    vendorAltText: string;
    altText: string;
    onSubmit: (alt: string) => void;
    params: EmbedPlayerParams;
    thumb: string | undefined;
}): any;
//# sourceMappingURL=GifAltText.d.ts.map