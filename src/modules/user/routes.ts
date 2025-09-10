import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../../db/client.js';
import { requireAuth } from '../../middlewares/auth.js';
import { parseWithZod } from '../../utils/validation.js';
import { NotFoundError, ValidationError } from '../../utils/errors.js';

const router = Router();

router.get('/me', requireAuth, async (req, res, next) => {
  try {
    const me = await prisma.user.findUnique({ where: { id: req.auth!.userId } });
    if (!me) throw new NotFoundError('User not found');
    res.json({ user: sanitizeUser(me) });
  } catch (err) {
    next(err);
  }
});

const profileSchema = z.object({ handle: z.string().min(1) });
router.get('/by-handle/:handle', async (req, res, next) => {
  try {
    const { handle } = parseWithZod(profileSchema, req.params);
    const user = await prisma.user.findUnique({ where: { handle: handle.toLowerCase() } });
    if (!user) throw new NotFoundError('User not found');
    res.json({ user: sanitizeUser(user) });
  } catch (err) {
    next(err);
  }
});

const updateSchema = z.object({
  displayName: z.string().min(1).max(64).optional(),
  bio: z.string().max(160).optional(),
  websiteUrl: z.string().url().optional().or(z.literal('')),
  location: z.string().max(64).optional(),
  avatarUrl: z.string().url().optional(),
  bannerUrl: z.string().url().optional(),
  isProtected: z.boolean().optional(),
  isDiscoverable: z.boolean().optional(),
});

router.patch('/me', requireAuth, async (req, res, next) => {
  try {
    const parsed = parseWithZod(updateSchema, req.body);
    const data: any = {};
    if (parsed.displayName !== undefined) data.displayName = parsed.displayName;
    if (parsed.bio !== undefined) data.bio = parsed.bio;
    if (parsed.websiteUrl !== undefined)
      data.websiteUrl = parsed.websiteUrl === '' ? null : parsed.websiteUrl;
    if (parsed.location !== undefined) data.location = parsed.location;
    if (parsed.avatarUrl !== undefined) data.avatarUrl = parsed.avatarUrl;
    if (parsed.bannerUrl !== undefined) data.bannerUrl = parsed.bannerUrl;
    if (parsed.isProtected !== undefined) data.isProtected = parsed.isProtected;
    if (parsed.isDiscoverable !== undefined) data.isDiscoverable = parsed.isDiscoverable;
    const updated = await prisma.user.update({ where: { id: req.auth!.userId }, data });
    res.json({ user: sanitizeUser(updated) });
  } catch (err) {
    next(err);
  }
});

const searchSchema = z.object({ q: z.string().min(1), limit: z.coerce.number().min(1).max(50).default(20) });
router.get('/search', async (req, res, next) => {
  try {
    const { q, limit } = parseWithZod(searchSchema, req.query);
    const users = await prisma.user.findMany({
      where: {
        OR: [
          { handle: { contains: q.toLowerCase() } },
          { displayName: { contains: q } },
        ],
      },
      take: limit,
      orderBy: { followersCount: 'desc' },
    });
    res.json({ users: users.map(sanitizeUser) });
  } catch (err) {
    next(err);
  }
});

function sanitizeUser(u: any) {
  const { passwordHash, email, ...rest } = u;
  return { ...rest, hasEmail: Boolean(email) };
}

export default router;

