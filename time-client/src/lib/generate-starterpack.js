import {} from '@atproto/api';
import { msg } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { useMutation } from '@tanstack/react-query';
import { until } from '#/lib/async/until';
import { sanitizeDisplayName } from '#/lib/strings/display-names';
import { sanitizeHandle } from '#/lib/strings/handles';
import { enforceLen } from '#/lib/strings/helpers';
import { useAgent } from '#/state/session';
export const createStarterPackList = async ({ name, description, descriptionFacets, profiles, agent, }) => {
    if (profiles.length === 0)
        throw new Error('No profiles given');
    const list = await agent.app.bsky.graph.list.create({ repo: agent.session.did }, {
        name,
        description,
        descriptionFacets,
        avatar: undefined,
        createdAt: new Date().toISOString(),
        purpose: 'app.bsky.graph.defs#referencelist',
    });
    if (!list)
        throw new Error('List creation failed');
    await agent.com.atproto.repo.applyWrites({
        repo: agent.session.did,
        writes: profiles.map(p => createListItem({ did: p.did, listUri: list.uri })),
    });
    return list;
};
export function useGenerateStarterPackMutation({ onSuccess, onError, }) {
    const { _ } = useLingui();
    const agent = useAgent();
    return useMutation({
        mutationFn: async () => {
            let profile;
            let profiles;
            await Promise.all([
                (async () => {
                    profile = (await agent.app.bsky.actor.getProfile({
                        actor: agent.session.did,
                    })).data;
                })(),
                (async () => {
                    profiles = (await agent.app.bsky.actor.searchActors({
                        q: encodeURIComponent('*'),
                        limit: 49,
                    })).data.actors.filter(p => p.viewer?.following);
                })(),
            ]);
            if (!profile || !profiles) {
                throw new Error('ERROR_DATA');
            }
            // We include ourselves when we make the list
            if (profiles.length < 7) {
                throw new Error('NOT_ENOUGH_FOLLOWERS');
            }
            const displayName = enforceLen(profile.displayName
                ? sanitizeDisplayName(profile.displayName)
                : `@${sanitizeHandle(profile.handle)}`, 25, true);
            const starterPackName = _(msg `${displayName}'s Starter Pack`);
            const list = await createStarterPackList({
                name: starterPackName,
                profiles,
                agent,
            });
            return await agent.app.bsky.graph.starterpack.create({
                repo: agent.session.did,
            }, {
                name: starterPackName,
                list: list.uri,
                createdAt: new Date().toISOString(),
            });
        },
        onSuccess: async (data) => {
            await whenAppViewReady(agent, data.uri, v => {
                return typeof v?.data.starterPack.uri === 'string';
            });
            onSuccess(data);
        },
        onError: error => {
            onError(error);
        },
    });
}
function createListItem({ did, listUri, }) {
    return {
        $type: 'com.atproto.repo.applyWrites#create',
        collection: 'app.bsky.graph.listitem',
        value: {
            $type: 'app.bsky.graph.listitem',
            subject: did,
            list: listUri,
            createdAt: new Date().toISOString(),
        },
    };
}
async function whenAppViewReady(agent, uri, fn) {
    await until(5, // 5 tries
    1e3, // 1s delay between tries
    fn, () => agent.app.bsky.graph.getStarterPack({ starterPack: uri }));
}
//# sourceMappingURL=generate-starterpack.js.map