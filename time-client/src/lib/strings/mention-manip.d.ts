interface FoundMention {
    value: string;
    index: number;
}
export declare function getMentionAt(text: string, cursorPos: number): FoundMention | undefined;
export declare function insertMentionAt(text: string, cursorPos: number, mention: string): string;
export {};
//# sourceMappingURL=mention-manip.d.ts.map