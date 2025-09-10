import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as Updates from 'expo-updates';
import { msg, Trans } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { useMutation, useQuery } from '@tanstack/react-query';
import * as Toast from '#/view/com/util/Toast';
import { Button, ButtonIcon, ButtonText } from '#/components/Button';
import { ArrowRotateCounterClockwise_Stroke2_Corner0_Rounded as RetryIcon } from '#/components/icons/ArrowRotateCounterClockwise';
import { Shapes_Stroke2_Corner0_Rounded as ShapesIcon } from '#/components/icons/Shapes';
import { Loader } from '#/components/Loader';
import * as SettingsList from '../components/SettingsList';
export function OTAInfo() {
    const { _ } = useLingui();
    const { data: isAvailable, isPending: isPendingInfo, isFetching: isFetchingInfo, isError: isErrorInfo, refetch, } = useQuery({
        queryKey: ['ota-info'],
        queryFn: async () => {
            const status = await Updates.checkForUpdateAsync();
            return status.isAvailable;
        },
    });
    const { mutate: fetchAndLaunchUpdate, isPending: isPendingUpdate } = useMutation({
        mutationFn: async () => {
            await Updates.fetchUpdateAsync();
            await Updates.reloadAsync();
        },
        onError: error => Toast.show(`Failed to update: ${error.message}`, 'xmark'),
    });
    if (!Updates.isEnabled || __DEV__) {
        return null;
    }
    return (_jsxs(SettingsList.Item, { children: [_jsx(SettingsList.ItemIcon, { icon: ShapesIcon }), _jsx(SettingsList.ItemText, { children: isAvailable ? (_jsx(Trans, { children: "OTA status: Available!" })) : isErrorInfo ? (_jsx(Trans, { children: "OTA status: Error fetching update" })) : isPendingInfo ? (_jsx(Trans, { children: "OTA status: ..." })) : (_jsx(Trans, { children: "OTA status: None available" })) }), _jsx(Button, { label: isAvailable ? _(msg `Update`) : _(msg `Fetch update`), disabled: isFetchingInfo || isPendingUpdate, variant: "solid", size: "small", color: isAvailable ? 'primary' : 'secondary_inverted', onPress: () => {
                    if (isFetchingInfo || isPendingUpdate)
                        return;
                    if (isAvailable) {
                        fetchAndLaunchUpdate();
                    }
                    else {
                        refetch();
                    }
                }, children: isAvailable ? (_jsx(ButtonText, { children: _jsx(Trans, { children: "Update" }) })) : (_jsx(ButtonIcon, { icon: isFetchingInfo ? Loader : RetryIcon })) })] }));
}
//# sourceMappingURL=OTAInfo.js.map