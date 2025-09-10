type CaptionsTrack = {
    lang: string;
    file: File;
};
interface Props {
    defaultAltText: string;
    captions: CaptionsTrack[];
    saveAltText: (altText: string) => void;
    setCaptions: (updater: (prev: CaptionsTrack[]) => CaptionsTrack[]) => void;
}
export declare function SubtitleDialogBtn(props: Props): any;
export {};
//# sourceMappingURL=SubtitleDialog.d.ts.map