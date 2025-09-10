import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../../db/client.js';
import { parseWithZod } from '../../utils/validation.js';
import { hashPassword, verifyPassword, generateAccessToken, generateRefreshToken } from '../../utils/security.js';
import { ValidationError, NotFoundError, AuthError } from '../../utils/errors.js';

const router = Router();

const registerSchema = z.object({
  email: z.string().email(),
  handle: z.string().min(3).max(32).regex(/^[a-zA-Z0-9_]+$/),
  displayName: z.string().min(1).max(64),
  password: z.string().min(8).max(128),
});

router.post('/register', async (req, res, next) => {
  try {
    const input = parseWithZod(registerSchema, req.body);
    const existing = await prisma.user.findFirst({ where: { OR: [{ email: input.email }, { handle: input.handle }] } });
    if (existing) {
      throw new ValidationError('Email or handle already in use');
    }
    const passwordHash = await hashPassword(input.password);
    const user = await prisma.user.create({
      data: {
        email: input.email.toLowerCase(),
        handle: input.handle.toLowerCase(),
        displayName: input.displayName,
        passwordHash,
      },
    });
    const access = generateAccessToken({ sub: user.id });
    const refresh = generateRefreshToken({ sub: user.id });
    // For simplicity, store refresh token in session table
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);
    await prisma.session.create({ data: { userId: user.id, refreshToken: refresh, expiresAt } });
    res.status(201).json({ user: { id: user.id, handle: user.handle, displayName: user.displayName }, tokens: { access, refresh } });
  } catch (err) {
    next(err);
  }
});

const loginSchema = z.object({ identifier: z.string(), password: z.string() });

router.post('/login', async (req, res, next) => {
  try {
    const input = parseWithZod(loginSchema, req.body);
    const user = await prisma.user.findFirst({ where: { OR: [{ email: input.identifier.toLowerCase() }, { handle: input.identifier.toLowerCase() }] } });
    if (!user) throw new NotFoundError('User not found');
    const ok = await verifyPassword(input.password, user.passwordHash);
    if (!ok) throw new AuthError('Invalid credentials');
    const access = generateAccessToken({ sub: user.id });
    const refresh = generateRefreshToken({ sub: user.id });
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);
    await prisma.session.create({ data: { userId: user.id, refreshToken: refresh, expiresAt } });
    res.json({ user: { id: user.id, handle: user.handle, displayName: user.displayName }, tokens: { access, refresh } });
  } catch (err) {
    next(err);
  }
});

const refreshSchema = z.object({ refreshToken: z.string() });

router.post('/refresh', async (req, res, next) => {
  try {
    const input = parseWithZod(refreshSchema, req.body);
    const session = await prisma.session.findUnique({ where: { refreshToken: input.refreshToken } });
    if (!session || session.revokedAt || session.expiresAt < new Date()) {
      throw new AuthError('Invalid or expired refresh token');
    }
    const access = generateAccessToken({ sub: session.userId });
    res.json({ access });
  } catch (err) {
    next(err);
  }
});

const logoutSchema = z.object({ refreshToken: z.string() });

router.post('/logout', async (req, res, next) => {
  try {
    const input = parseWithZod(logoutSchema, req.body);
    await prisma.session.update({ where: { refreshToken: input.refreshToken }, data: { revokedAt: new Date() } });
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

export default router;

