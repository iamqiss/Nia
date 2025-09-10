import { jest } from '@jest/globals';
export { Nux } from '#/state/queries/nuxs/definitions';
export const useNuxs = jest.fn(() => {
    return {
        nuxs: undefined,
        status: 'loading',
    };
});
export const useNux = jest.fn((id) => {
    return {
        nux: undefined,
        status: 'loading',
    };
});
export const useSaveNux = jest.fn(() => {
    return {};
});
export const useResetNuxs = jest.fn(() => {
    return {};
});
//# sourceMappingURL=index.js.map