import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../../db/client.js';
import { requireAuth } from '../../middlewares/auth.js';
import { parseWithZod } from '../../utils/validation.js';
import { ValidationError } from '../../utils/errors.js';
const router = Router();
const idParam = z.object({ userId: z.string().min(1) });
router.post('/follow/:userId', requireAuth, async (req, res, next) => {
    try {
        const { userId } = parseWithZod(idParam, req.params);
        if (userId === req.auth.userId)
            throw new ValidationError('Cannot follow yourself');
        await prisma.$transaction(async (tx) => {
            await tx.follow.create({ data: { followerId: req.auth.userId, followingId: userId } });
            await tx.user.update({ where: { id: req.auth.userId }, data: { followingCount: { increment: 1 } } });
            await tx.user.update({ where: { id: userId }, data: { followersCount: { increment: 1 } } });
        });
        res.json({ ok: true });
    }
    catch (err) {
        next(err);
    }
});
router.post('/unfollow/:userId', requireAuth, async (req, res, next) => {
    try {
        const { userId } = parseWithZod(idParam, req.params);
        await prisma.$transaction(async (tx) => {
            await tx.follow.delete({ where: { followerId_followingId: { followerId: req.auth.userId, followingId: userId } } });
            await tx.user.update({ where: { id: req.auth.userId }, data: { followingCount: { decrement: 1 } } });
            await tx.user.update({ where: { id: userId }, data: { followersCount: { decrement: 1 } } });
        });
        res.json({ ok: true });
    }
    catch (err) {
        next(err);
    }
});
router.post('/block/:userId', requireAuth, async (req, res, next) => {
    try {
        const { userId } = parseWithZod(idParam, req.params);
        if (userId === req.auth.userId)
            throw new ValidationError('Cannot block yourself');
        await prisma.block.create({ data: { blockerId: req.auth.userId, blockedId: userId } });
        res.json({ ok: true });
    }
    catch (err) {
        next(err);
    }
});
router.post('/unblock/:userId', requireAuth, async (req, res, next) => {
    try {
        const { userId } = parseWithZod(idParam, req.params);
        await prisma.block.delete({ where: { blockerId_blockedId: { blockerId: req.auth.userId, blockedId: userId } } });
        res.json({ ok: true });
    }
    catch (err) {
        next(err);
    }
});
router.post('/mute/:userId', requireAuth, async (req, res, next) => {
    try {
        const { userId } = parseWithZod(idParam, req.params);
        if (userId === req.auth.userId)
            throw new ValidationError('Cannot mute yourself');
        await prisma.mute.create({ data: { muterId: req.auth.userId, mutedId: userId } });
        res.json({ ok: true });
    }
    catch (err) {
        next(err);
    }
});
router.post('/unmute/:userId', requireAuth, async (req, res, next) => {
    try {
        const { userId } = parseWithZod(idParam, req.params);
        await prisma.mute.delete({ where: { muterId_mutedId: { muterId: req.auth.userId, mutedId: userId } } });
        res.json({ ok: true });
    }
    catch (err) {
        next(err);
    }
});
export default router;
//# sourceMappingURL=routes.js.map