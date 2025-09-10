import { ZodError } from 'zod';
import { ValidationError } from './errors.js';
export function parseWithZod(schema, payload) {
    try {
        return schema.parse(payload);
    }
    catch (err) {
        if (err instanceof ZodError) {
            throw new ValidationError('Validation failed', err.flatten());
        }
        throw err;
    }
}
//# sourceMappingURL=validation.js.map