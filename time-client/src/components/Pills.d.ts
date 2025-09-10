import React from 'react';
import { type ModerationCause } from '@atproto/api';
import { type ViewStyleProp } from '#/alf';
export type AppModerationCause = ModerationCause | {
    type: 'reply-hidden';
    source: {
        type: 'user';
        did: string;
    };
    priority: 6;
    downgraded?: boolean;
};
export type CommonProps = {
    size?: 'sm' | 'lg';
};
export declare function Row({ children, style, size, }: {
    children: React.ReactNode | React.ReactNode[];
} & CommonProps & ViewStyleProp): any;
export type LabelProps = {
    cause: AppModerationCause;
    disableDetailsDialog?: boolean;
    noBg?: boolean;
} & CommonProps;
export declare function Label({ cause, size, disableDetailsDialog, noBg, }: LabelProps): any;
export declare function FollowsYou({ size }: CommonProps): any;
//# sourceMappingURL=Pills.d.ts.map