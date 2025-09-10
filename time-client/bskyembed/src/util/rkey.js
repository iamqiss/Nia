import { AtUri } from '@atproto/api';
export function getRkey({ uri }) {
    const at = new AtUri(uri);
    return at.rkey;
}
//# sourceMappingURL=rkey.js.map