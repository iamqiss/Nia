import { useMutation } from '@tanstack/react-query';
import { useAgent } from '#/state/session';
export function useLikeMutation() {
    const agent = useAgent();
    return useMutation({
        mutationFn: async ({ uri, cid }) => {
            const res = await agent.like(uri, cid);
            return { uri: res.uri };
        },
    });
}
export function useUnlikeMutation() {
    const agent = useAgent();
    return useMutation({
        mutationFn: async ({ uri }) => {
            await agent.deleteLike(uri);
        },
    });
}
//# sourceMappingURL=like.js.map