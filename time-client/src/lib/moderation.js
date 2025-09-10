import React from 'react';
import { BskyAgent, LABELS, } from '@atproto/api';
import { sanitizeDisplayName } from '#/lib/strings/display-names';
import { sanitizeHandle } from '#/lib/strings/handles';
import {} from '#/components/Pills';
export const ADULT_CONTENT_LABELS = ['sexual', 'nudity', 'porn'];
export const OTHER_SELF_LABELS = ['graphic-media'];
export const SELF_LABELS = [...ADULT_CONTENT_LABELS, ...OTHER_SELF_LABELS];
export function getModerationCauseKey(cause) {
    const source = cause.source.type === 'labeler'
        ? cause.source.did
        : cause.source.type === 'list'
            ? cause.source.list.uri
            : 'user';
    if (cause.type === 'label') {
        return `label:${cause.label.val}:${source}`;
    }
    return `${cause.type}:${source}`;
}
export function isJustAMute(modui) {
    return modui.filters.length === 1 && modui.filters[0].type === 'muted';
}
export function moduiContainsHideableOffense(modui) {
    const label = modui.filters.at(0);
    if (label && label.type === 'label') {
        return labelIsHideableOffense(label.label);
    }
    return false;
}
export function labelIsHideableOffense(label) {
    return ['!hide', '!takedown'].includes(label.val);
}
export function getLabelingServiceTitle({ displayName, handle, }) {
    return displayName
        ? sanitizeDisplayName(displayName)
        : sanitizeHandle(handle, '@');
}
export function lookupLabelValueDefinition(labelValue, customDefs) {
    let def;
    if (!labelValue.startsWith('!') && customDefs) {
        def = customDefs.find(d => d.identifier === labelValue);
    }
    if (!def) {
        def = LABELS[labelValue];
    }
    return def;
}
export function isAppLabeler(labeler) {
    if (typeof labeler === 'string') {
        return BskyAgent.appLabelers.includes(labeler);
    }
    return BskyAgent.appLabelers.includes(labeler.creator.did);
}
export function isLabelerSubscribed(labeler, modOpts) {
    labeler = typeof labeler === 'string' ? labeler : labeler.creator.did;
    if (isAppLabeler(labeler)) {
        return true;
    }
    return modOpts.prefs.labelers.find(l => l.did === labeler);
}
export function useLabelSubject({ label }) {
    return React.useMemo(() => {
        const { cid, uri } = label;
        if (cid) {
            return {
                subject: {
                    uri,
                    cid,
                },
            };
        }
        else {
            return {
                subject: {
                    did: uri,
                },
            };
        }
    }, [label]);
}
export function unique(value, index, array) {
    return (array.findIndex(item => getModerationCauseKey(item) === getModerationCauseKey(value)) === index);
}
//# sourceMappingURL=moderation.js.map