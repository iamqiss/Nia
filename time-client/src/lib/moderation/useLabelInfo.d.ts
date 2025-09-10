import { type AppBskyLabelerDefs, type ComAtprotoLabelDefs, type InterpretedLabelValueDefinition } from '@atproto/api';
import { type GlobalLabelStrings } from '#/lib/moderation/useGlobalLabelStrings';
export interface LabelInfo {
    label: ComAtprotoLabelDefs.Label;
    def: InterpretedLabelValueDefinition;
    strings: ComAtprotoLabelDefs.LabelValueDefinitionStrings;
    labeler: AppBskyLabelerDefs.LabelerViewDetailed | undefined;
}
export declare function useLabelInfo(label: ComAtprotoLabelDefs.Label): LabelInfo;
export declare function getDefinition(labelDefs: Record<string, InterpretedLabelValueDefinition[]>, label: ComAtprotoLabelDefs.Label): InterpretedLabelValueDefinition;
export declare function getLabelStrings(locale: string, globalLabelStrings: GlobalLabelStrings, def: InterpretedLabelValueDefinition): ComAtprotoLabelDefs.LabelValueDefinitionStrings;
//# sourceMappingURL=useLabelInfo.d.ts.map