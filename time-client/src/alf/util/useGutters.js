import React from 'react';
import { useBreakpoints } from '#/alf/breakpoints';
import * as tokens from '#/alf/tokens';
const gutters = {
    compact: {
        default: tokens.space.sm,
        gtPhone: tokens.space.sm,
        gtMobile: tokens.space.md,
        gtTablet: tokens.space.md,
    },
    base: {
        default: tokens.space.lg,
        gtPhone: tokens.space.lg,
        gtMobile: tokens.space.xl,
        gtTablet: tokens.space.xl,
    },
    wide: {
        default: tokens.space.xl,
        gtPhone: tokens.space.xl,
        gtMobile: tokens.space._3xl,
        gtTablet: tokens.space._3xl,
    },
};
export function useGutters([top, right, bottom, left]) {
    const { activeBreakpoint } = useBreakpoints();
    if (right === undefined) {
        right = bottom = left = top;
    }
    else if (bottom === undefined) {
        bottom = top;
        left = right;
    }
    return React.useMemo(() => {
        return {
            paddingTop: top === 0 ? 0 : gutters[top][activeBreakpoint || 'default'],
            paddingRight: right === 0 ? 0 : gutters[right][activeBreakpoint || 'default'],
            paddingBottom: bottom === 0 ? 0 : gutters[bottom][activeBreakpoint || 'default'],
            paddingLeft: left === 0 ? 0 : gutters[left][activeBreakpoint || 'default'],
        };
    }, [activeBreakpoint, top, right, bottom, left]);
}
//# sourceMappingURL=useGutters.js.map