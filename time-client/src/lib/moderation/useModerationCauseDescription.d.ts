import React from 'react';
import { type ModerationCause, type ModerationCauseSource } from '@atproto/api';
import { type Props as SVGIconProps } from '#/components/icons/common';
import { type AppModerationCause } from '#/components/Pills';
export interface ModerationCauseDescription {
    icon: React.ComponentType<SVGIconProps>;
    name: string;
    description: string;
    source?: string;
    sourceDisplayName?: string;
    sourceType?: ModerationCauseSource['type'];
    sourceAvi?: string;
    sourceDid?: string;
}
export declare function useModerationCauseDescription(cause: ModerationCause | AppModerationCause | undefined): ModerationCauseDescription;
//# sourceMappingURL=useModerationCauseDescription.d.ts.map