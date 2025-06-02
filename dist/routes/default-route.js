import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
const router = Router();
router.get('/', async (req, res, next) => {
    try {
        const db = new PrismaClient();
        res.json();
    }
    catch (error) {
        return next(error);
    }
});
export default router;
//# sourceMappingURL=default-route.js.map