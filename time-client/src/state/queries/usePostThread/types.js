import {} from '@atproto/api';
export const postThreadQueryKeyRoot = 'post-thread-v2';
export const createPostThreadQueryKey = (props) => [postThreadQueryKeyRoot, props];
export const createPostThreadOtherQueryKey = (props) => [postThreadQueryKeyRoot, 'other', props];
//# sourceMappingURL=types.js.map