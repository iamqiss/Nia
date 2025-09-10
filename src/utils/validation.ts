import { ZodError, type ZodSchema } from 'zod';
import { ValidationError } from './errors.js';

export function parseWithZod<T>(schema: ZodSchema<T>, payload: unknown): T {
  try {
    return schema.parse(payload);
  } catch (err) {
    if (err instanceof ZodError) {
      throw new ValidationError('Validation failed', err.flatten());
    }
    throw err;
  }
}

