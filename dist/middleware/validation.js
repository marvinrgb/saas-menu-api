import { ZodError } from 'zod';
import { ApiError } from '../types/api.types.js';
export const validate = (schema) => {
    return async (req, res, next) => {
        try {
            await schema.parseAsync({
                body: req.body,
                query: req.query,
                params: req.params,
            });
            next();
        }
        catch (error) {
            if (error instanceof ZodError) {
                const validationError = new ApiError(400, 'VALIDATION_ERROR', 'Invalid request data', error.errors);
                next(validationError);
            }
            else {
                next(error);
            }
        }
    };
};
//# sourceMappingURL=validation.js.map