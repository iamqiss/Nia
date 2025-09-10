import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { randomBytes } from 'crypto';
import { config } from '../config/index.js';
export async function hashPassword(plain) {
    const saltRounds = config.crypto.bcryptRounds;
    return bcrypt.hash(plain, saltRounds);
}
export async function verifyPassword(plain, hash) {
    return bcrypt.compare(plain, hash);
}
export function generateAccessToken(payload) {
    return jwt.sign(payload, config.jwt.accessSecret, { expiresIn: config.jwt.accessTtlSec });
}
export function generateRefreshToken(payload) {
    return jwt.sign(payload, config.jwt.refreshSecret, { expiresIn: config.jwt.refreshTtlSec });
}
export function verifyAccessToken(token) {
    return jwt.verify(token, config.jwt.accessSecret);
}
export function verifyRefreshToken(token) {
    return jwt.verify(token, config.jwt.refreshSecret);
}
export function generateRandomToken(bytes = 32) {
    return randomBytes(bytes).toString('hex');
}
//# sourceMappingURL=security.js.map