import { jsx as _jsx } from "react/jsx-runtime";
import { useMemo } from 'react';
import { msg } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import {} from '#/lib/routes/types';
import { useProfileQuery } from '#/state/queries/profile';
import { useResolveDidQuery } from '#/state/queries/resolve-uri';
import { useSession } from '#/state/session';
import { SearchScreenShell } from '#/screens/Search/Shell';
export const ProfileSearchScreen = ({ route }) => {
    const { name, q: queryParam = '' } = route.params;
    const { _ } = useLingui();
    const { currentAccount } = useSession();
    const { data: resolvedDid } = useResolveDidQuery(name);
    const { data: profile } = useProfileQuery({ did: resolvedDid });
    const fixedParams = useMemo(() => ({
        from: profile?.handle ?? name,
    }), [profile?.handle, name]);
    return (_jsx(SearchScreenShell, { navButton: "back", inputPlaceholder: profile
            ? currentAccount?.did === profile.did
                ? _(msg `Search my posts`)
                : _(msg `Search @${profile.handle}'s posts`)
            : _(msg `Search...`), fixedParams: fixedParams, queryParam: queryParam, testID: "searchPostsScreen" }));
};
//# sourceMappingURL=ProfileSearch.js.map