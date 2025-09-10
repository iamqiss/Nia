import { type ImagePickerAsset } from 'expo-image-picker';
export type SelectMediaButtonProps = {
    disabled?: boolean;
    /**
     * If set, this limits the types of assets that can be selected.
     */
    allowedAssetTypes: AssetType | undefined;
    selectedAssetsCount: number;
    onSelectAssets: (props: {
        type: AssetType;
        assets: ImagePickerAsset[];
        errors: string[];
    }) => void;
};
/**
 * Generic asset classes, or buckets, that we support.
 */
export type AssetType = 'video' | 'image' | 'gif';
export declare function SelectMediaButton({ disabled, allowedAssetTypes, selectedAssetsCount, onSelectAssets, }: SelectMediaButtonProps): any;
//# sourceMappingURL=SelectMediaButton.d.ts.map