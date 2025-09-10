import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import authRoutes from './modules/auth/routes.js';
import userRoutes from './modules/user/routes.js';
import socialRoutes from './modules/social/routes.js';
import { errorHandler } from './middlewares/error.js';
import { config } from './config/index.js';
import { logger } from './utils/logger.js';
const app = express();
app.use(cors());
app.use(helmet());
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.get('/health', (_req, res) => {
    res.json({ status: 'ok', uptime: process.uptime() });
});
app.use(rateLimit({
    windowMs: config.rateLimit.windowMs,
    max: config.rateLimit.max,
    standardHeaders: true,
    legacyHeaders: false,
}));
// Routes will be mounted here
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/social', socialRoutes);
// Global error handler placeholder
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use(errorHandler);
app.listen(config.port, () => {
    logger.info(`Server listening on http://localhost:${config.port}`);
});
//# sourceMappingURL=server.js.map