import { nuxSchema } from '@atproto/api';
import { nuxNames, NuxSchemas, } from '#/state/queries/nuxs/definitions';
export function parseAppNux(nux) {
    if (!nuxNames.has(nux.id))
        return;
    if (!nuxSchema.safeParse(nux).success)
        return;
    const { data, ...rest } = nux;
    const schema = NuxSchemas[nux.id];
    if (schema && data) {
        const parsedData = JSON.parse(data);
        if (!schema.safeParse(parsedData).success)
            return;
        return {
            ...rest,
            data: parsedData,
        };
    }
    return {
        ...rest,
        data: undefined,
    };
}
export function serializeAppNux(nux) {
    const { data, ...rest } = nux;
    const schema = NuxSchemas[nux.id];
    const result = {
        ...rest,
        data: undefined,
    };
    if (schema) {
        schema.parse(data);
        result.data = JSON.stringify(data);
    }
    nuxSchema.parse(result);
    return result;
}
//# sourceMappingURL=util.js.map