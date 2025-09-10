import { useMutation } from '@tanstack/react-query';
import { useAgent } from '#/state/session';
import { useRequestEmailUpdate } from '#/components/dialogs/EmailDialog/data/useRequestEmailUpdate';
async function updateEmailAndRefreshSession(agent, email, token) {
    await agent.com.atproto.server.updateEmail({ email: email.trim(), token });
    await agent.resumeSession(agent.session);
}
export function useUpdateEmail() {
    const agent = useAgent();
    const { mutateAsync: requestEmailUpdate } = useRequestEmailUpdate();
    return useMutation({
        mutationFn: async ({ email, token }) => {
            if (token) {
                await updateEmailAndRefreshSession(agent, email, token);
                return {
                    status: 'success',
                };
            }
            else {
                const { tokenRequired } = await requestEmailUpdate();
                if (tokenRequired) {
                    return {
                        status: 'tokenRequired',
                    };
                }
                else {
                    await updateEmailAndRefreshSession(agent, email, token);
                    return {
                        status: 'success',
                    };
                }
            }
        },
    });
}
//# sourceMappingURL=useUpdateEmail.js.map