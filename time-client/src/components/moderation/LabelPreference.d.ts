import { type InterpretedLabelValueDefinition } from '@atproto/api';
import * as ToggleButton from '#/components/forms/ToggleButton';
export declare function Outer({ children }: React.PropsWithChildren<{}>): any;
export declare function Content({ children, name, description, }: React.PropsWithChildren<{
    name: string;
    description: string;
}>): any;
export declare function Buttons({ name, values, onChange, ignoreLabel, warnLabel, hideLabel, disabled, }: {
    name: string;
    values: ToggleButton.GroupProps['values'];
    onChange: ToggleButton.GroupProps['onChange'];
    ignoreLabel?: string;
    warnLabel?: string;
    hideLabel?: string;
    disabled?: boolean;
}): any;
/**
 * For use on the global Moderation screen to set prefs for a "global" label,
 * not scoped to a single labeler.
 */
export declare function GlobalLabelPreference({ labelDefinition, disabled, }: {
    labelDefinition: InterpretedLabelValueDefinition;
    disabled?: boolean;
}): any;
/**
 * For use on individual labeler pages
 */
export declare function LabelerLabelPreference({ labelDefinition, disabled, labelerDid, }: {
    labelDefinition: InterpretedLabelValueDefinition;
    disabled?: boolean;
    labelerDid?: string;
}): any;
//# sourceMappingURL=LabelPreference.d.ts.map