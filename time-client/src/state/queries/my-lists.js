import {} from '@atproto/api';
import { useQuery } from '@tanstack/react-query';
import { accumulate } from '#/lib/async/accumulate';
import { STALE } from '#/state/queries';
import { useAgent, useSession } from '#/state/session';
const RQKEY_ROOT = 'my-lists';
export const RQKEY = (filter) => [RQKEY_ROOT, filter];
export function useMyListsQuery(filter) {
    const { currentAccount } = useSession();
    const agent = useAgent();
    return useQuery({
        staleTime: STALE.MINUTES.ONE,
        queryKey: RQKEY(filter),
        async queryFn() {
            let lists = [];
            const promises = [
                accumulate(cursor => agent.app.bsky.graph
                    .getLists({
                    actor: currentAccount.did,
                    cursor,
                    limit: 50,
                })
                    .then(res => ({
                    cursor: res.data.cursor,
                    items: res.data.lists,
                }))),
            ];
            if (filter === 'all-including-subscribed' || filter === 'mod') {
                promises.push(accumulate(cursor => agent.app.bsky.graph
                    .getListMutes({
                    cursor,
                    limit: 50,
                })
                    .then(res => ({
                    cursor: res.data.cursor,
                    items: res.data.lists,
                }))));
                promises.push(accumulate(cursor => agent.app.bsky.graph
                    .getListBlocks({
                    cursor,
                    limit: 50,
                })
                    .then(res => ({
                    cursor: res.data.cursor,
                    items: res.data.lists,
                }))));
            }
            const resultset = await Promise.all(promises);
            for (const res of resultset) {
                for (let list of res) {
                    if (filter === 'curate' &&
                        list.purpose !== 'app.bsky.graph.defs#curatelist') {
                        continue;
                    }
                    if (filter === 'mod' &&
                        list.purpose !== 'app.bsky.graph.defs#modlist') {
                        continue;
                    }
                    if (!lists.find(l => l.uri === list.uri)) {
                        lists.push(list);
                    }
                }
            }
            return lists;
        },
        enabled: !!currentAccount,
    });
}
export function invalidate(qc, filter) {
    if (filter) {
        qc.invalidateQueries({ queryKey: RQKEY(filter) });
    }
    else {
        qc.invalidateQueries({ queryKey: [RQKEY_ROOT] });
    }
}
//# sourceMappingURL=my-lists.js.map