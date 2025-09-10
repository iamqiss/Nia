interface Props {
    isReposted: boolean;
    repostCount?: number;
    onRepost: () => void;
    onQuote: () => void;
    big?: boolean;
    embeddingDisabled: boolean;
}
declare let RepostButton: ({ isReposted, repostCount, onRepost, onQuote, big, embeddingDisabled, }: Props) => React.ReactNode;
export { RepostButton };
declare let RepostButtonDialogInner: ({ isReposted, onRepost, onQuote, embeddingDisabled, }: {
    isReposted: boolean;
    onRepost: () => void;
    onQuote: () => void;
    embeddingDisabled: boolean;
}) => React.ReactNode;
export { RepostButtonDialogInner };
//# sourceMappingURL=RepostButton.d.ts.map