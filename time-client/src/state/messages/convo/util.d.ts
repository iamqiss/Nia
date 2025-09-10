import { type ConvoState, type ConvoStateBackgrounded, type ConvoStateDisabled, type ConvoStateReady, type ConvoStateSuspended } from './types';
/**
 * States where the convo is ready to be used - either ready, or backgrounded/suspended
 * and ready to be resumed
 */
export type ActiveConvoStates = ConvoStateReady | ConvoStateBackgrounded | ConvoStateSuspended | ConvoStateDisabled;
/**
 * Checks if a `Convo` has a `status` that is "active", meaning the chat is
 * loaded and ready to be used, or its in a suspended or background state, and
 * ready for resumption.
 */
export declare function isConvoActive(convo: ConvoState): convo is ActiveConvoStates;
//# sourceMappingURL=util.d.ts.map