import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { randomBytes } from 'crypto';
import { config } from '../config/index.js';

export async function hashPassword(plain: string): Promise<string> {
  const saltRounds = config.crypto.bcryptRounds;
  return bcrypt.hash(plain, saltRounds);
}

export async function verifyPassword(plain: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plain, hash);
}

export function generateAccessToken(payload: object): string {
  return jwt.sign(payload, config.jwt.accessSecret, { expiresIn: config.jwt.accessTtlSec });
}

export function generateRefreshToken(payload: object): string {
  return jwt.sign(payload, config.jwt.refreshSecret, { expiresIn: config.jwt.refreshTtlSec });
}

export function verifyAccessToken(token: string): any {
  return jwt.verify(token, config.jwt.accessSecret);
}

export function verifyRefreshToken(token: string): any {
  return jwt.verify(token, config.jwt.refreshSecret);
}

export function generateRandomToken(bytes = 32): string {
  return randomBytes(bytes).toString('hex');
}

