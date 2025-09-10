import { jsx as _jsx } from "react/jsx-runtime";
import { useMemo } from 'react';
import { Trans } from '@lingui/macro';
import { useRequireEmailVerification } from '#/lib/hooks/useRequireEmailVerification';
import { useOpenComposer as useRootOpenComposer } from '#/state/shell/composer';
export function useOpenComposer() {
    const { openComposer } = useRootOpenComposer();
    const requireEmailVerification = useRequireEmailVerification();
    return useMemo(() => {
        return {
            openComposer: requireEmailVerification(openComposer, {
                instructions: [
                    _jsx(Trans, { children: "Before creating a post or replying, you must first verify your email." }, "pre-compose"),
                ],
            }),
        };
    }, [openComposer, requireEmailVerification]);
}
//# sourceMappingURL=useOpenComposer.js.map