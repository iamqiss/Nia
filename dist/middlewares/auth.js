import { verifyAccessToken } from '../utils/security.js';
import { AuthError } from '../utils/errors.js';
export function requireAuth(req, _res, next) {
    const header = req.headers.authorization;
    if (!header?.startsWith('Bearer ')) {
        return next(new AuthError('Missing bearer token'));
    }
    const token = header.slice('Bearer '.length);
    try {
        const decoded = verifyAccessToken(token);
        const userId = decoded.sub || decoded.userId;
        if (!userId) {
            return next(new AuthError('Invalid token payload'));
        }
        req.auth = { userId };
        return next();
    }
    catch (_err) {
        return next(new AuthError('Invalid or expired token'));
    }
}
//# sourceMappingURL=auth.js.map