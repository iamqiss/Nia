import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { Pressable, View } from 'react-native';
import {} from 'react-native-gesture-handler';
import { msg, Trans } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import {} from '#/lib/moderation/useReportOptions';
import { useMyLabelersQuery } from '#/state/queries/preferences';
export { useDialogControl as useReportDialogControl } from '#/components/Dialog';
import {} from '@atproto/api';
import { atoms as a } from '#/alf';
import * as Dialog from '#/components/Dialog';
import { useDelayedLoading } from '#/components/hooks/useDelayedLoading';
import { Loader } from '#/components/Loader';
import { Text } from '#/components/Typography';
import { SelectLabelerView } from './SelectLabelerView';
import { SelectReportOptionView } from './SelectReportOptionView';
import { SubmitView } from './SubmitView';
import {} from './types';
export function ReportDialog(props) {
    return (_jsxs(Dialog.Outer, { control: props.control, children: [_jsx(Dialog.Handle, {}), _jsx(ReportDialogInner, { ...props })] }));
}
function ReportDialogInner(props) {
    const { _ } = useLingui();
    const { isLoading: isLabelerLoading, data: labelers, error, } = useMyLabelersQuery({ excludeNonConfigurableLabelers: true });
    const isLoading = useDelayedLoading(500, isLabelerLoading);
    const ref = React.useRef(null);
    return (_jsx(Dialog.ScrollableInner, { label: _(msg `Report dialog`), ref: ref, children: isLoading ? (_jsxs(View, { style: [a.align_center, { height: 100 }], children: [_jsx(Loader, { size: "xl" }), _jsx(Pressable, { accessible: false })] })) : error || !labelers ? (_jsx(View, { children: _jsx(Text, { style: [a.text_md], children: _jsx(Trans, { children: "Something went wrong, please try again." }) }) })) : (_jsx(ReportDialogLoaded, { labelers: labelers, ...props })) }));
}
function ReportDialogLoaded(props) {
    const [selectedLabeler, setSelectedLabeler] = React.useState(props.labelers.length === 1 ? props.labelers[0].creator.did : undefined);
    const [selectedReportOption, setSelectedReportOption] = React.useState();
    if (selectedReportOption && selectedLabeler) {
        return (_jsx(SubmitView, { ...props, selectedLabeler: selectedLabeler, selectedReportOption: selectedReportOption, goBack: () => setSelectedReportOption(undefined), onSubmitComplete: () => props.control.close() }));
    }
    if (selectedLabeler) {
        return (_jsx(SelectReportOptionView, { ...props, goBack: () => setSelectedLabeler(undefined), onSelectReportOption: setSelectedReportOption }));
    }
    return _jsx(SelectLabelerView, { ...props, onSelectLabeler: setSelectedLabeler });
}
//# sourceMappingURL=index.js.map