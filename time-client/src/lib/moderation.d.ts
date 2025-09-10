import { type AppBskyLabelerDefs, type ComAtprotoLabelDefs, type InterpretedLabelValueDefinition, type ModerationCause, type ModerationOpts, type ModerationUI } from '@atproto/api';
import { type AppModerationCause } from '#/components/Pills';
export declare const ADULT_CONTENT_LABELS: string[];
export declare const OTHER_SELF_LABELS: string[];
export declare const SELF_LABELS: string[];
export type AdultSelfLabel = (typeof ADULT_CONTENT_LABELS)[number];
export type OtherSelfLabel = (typeof OTHER_SELF_LABELS)[number];
export type SelfLabel = (typeof SELF_LABELS)[number];
export declare function getModerationCauseKey(cause: ModerationCause | AppModerationCause): string;
export declare function isJustAMute(modui: ModerationUI): boolean;
export declare function moduiContainsHideableOffense(modui: ModerationUI): boolean;
export declare function labelIsHideableOffense(label: ComAtprotoLabelDefs.Label): boolean;
export declare function getLabelingServiceTitle({ displayName, handle, }: {
    displayName?: string;
    handle: string;
}): any;
export declare function lookupLabelValueDefinition(labelValue: string, customDefs: InterpretedLabelValueDefinition[] | undefined): InterpretedLabelValueDefinition | undefined;
export declare function isAppLabeler(labeler: string | AppBskyLabelerDefs.LabelerView | AppBskyLabelerDefs.LabelerViewDetailed): boolean;
export declare function isLabelerSubscribed(labeler: string | AppBskyLabelerDefs.LabelerView | AppBskyLabelerDefs.LabelerViewDetailed, modOpts: ModerationOpts): any;
export type Subject = {
    uri: string;
    cid: string;
} | {
    did: string;
};
export declare function useLabelSubject({ label }: {
    label: ComAtprotoLabelDefs.Label;
}): {
    subject: Subject;
};
export declare function unique(value: ModerationCause, index: number, array: ModerationCause[]): boolean;
//# sourceMappingURL=moderation.d.ts.map