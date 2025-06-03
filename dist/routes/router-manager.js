import { Router } from 'express';
import { errorHandler } from '../middleware/error-handler.js';
import defaultRoute from './default-route.js';
import restaurantRoutes from './restaurant.routes.js';
import menuRoutes from './menu.routes.js';
import categoryRoutes from './category.routes.js';
import menuItemsRoutes from './menuItems.js';
import optionGroupsRoutes from './optionGroups.js';
import optionsRoutes from './options.js';
import specialOffersRoutes from './specialOffers.js';
const router = Router();
// Apply error handling middleware
router.use(errorHandler);
// API routes
router.use('/default', defaultRoute);
router.use('/restaurants', restaurantRoutes);
router.use('/menus', menuRoutes);
router.use('/categories', categoryRoutes);
router.use('/menu-items', menuItemsRoutes);
router.use('/option-groups', optionGroupsRoutes);
router.use('/options', optionsRoutes);
router.use('/special-offers', specialOffersRoutes);
export default router;
//# sourceMappingURL=router-manager.js.map