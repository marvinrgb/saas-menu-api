import { Router } from 'express';
import { errorHandler } from '../middleware/error-handler.js';
import defaultRoute from './default-route.js';
import restaurantRoutes from './restaurant.routes.js';
import menuRoutes from './menu.routes.js';
import categoryRoutes from './category.routes.js';
const router = Router();
// Apply error handling middleware
router.use(errorHandler);
// API routes
router.use('/default', defaultRoute);
router.use('/restaurants', restaurantRoutes);
router.use('/menus', menuRoutes);
router.use('/categories', categoryRoutes);
export default router;
//# sourceMappingURL=router-manager.js.map