import { type GeolocationStatus } from '#/state/geolocation';
import * as Dialog from '#/components/Dialog';
export type Props = {
    onLocationAcquired?: (props: {
        geolocationStatus: GeolocationStatus;
        setDialogError: (error: string) => void;
        disableDialogAction: () => void;
        closeDialog: (callback?: () => void) => void;
    }) => void;
};
export declare function DeviceLocationRequestDialog({ control, onLocationAcquired, }: Props & {
    control: Dialog.DialogOuterProps['control'];
}): any;
//# sourceMappingURL=DeviceLocationRequestDialog.d.ts.map