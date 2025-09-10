import { jsx as _jsx } from "react/jsx-runtime";
import {} from 'react-native';
import {} from '@atproto/api';
import { makeProfileLink } from '#/lib/routes/links';
import { sanitizeDisplayName } from '#/lib/strings/display-names';
import { sanitizeHandle } from '#/lib/strings/handles';
import { STALE } from '#/state/queries';
import { useProfileQuery } from '#/state/queries/profile';
import { atoms as a } from '#/alf';
import { InlineLinkText } from '#/components/Link';
import { Text } from '#/components/Typography';
import { LoadingPlaceholder } from './LoadingPlaceholder';
export function UserInfoText({ did, attr, failed, prefix, style, }) {
    attr = attr || 'handle';
    failed = failed || 'user';
    const { data: profile, isError } = useProfileQuery({
        did,
        staleTime: STALE.INFINITY,
    });
    if (isError) {
        return (_jsx(Text, { style: style, numberOfLines: 1, children: failed }));
    }
    else if (profile) {
        const text = `${prefix || ''}${sanitizeDisplayName(typeof profile[attr] === 'string' && profile[attr]
            ? profile[attr]
            : sanitizeHandle(profile.handle))}`;
        return (_jsx(InlineLinkText, { label: text, style: style, numberOfLines: 1, to: makeProfileLink(profile), children: _jsx(Text, { emoji: true, style: style, children: text }) }));
    }
    // eslint-disable-next-line bsky-internal/avoid-unwrapped-text
    return (_jsx(LoadingPlaceholder, { width: 80, height: 8, style: [a.relative, { top: 1, left: 2 }] }));
}
//# sourceMappingURL=UserInfoText.js.map