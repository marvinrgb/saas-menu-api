import { Router } from 'express';
import { createMenuItem, deleteMenuItem, getMenuItemById, listMenuItems, updateMenuItem, reorderMenuItem } from '../controllers/menuItemController.js';
const router = Router();
// List menu items (potentially filtered by category)
router.get('/', listMenuItems);
// Create a new menu item
router.post('/', createMenuItem);
// Get a menu item by ID
router.get('/:id', getMenuItemById);
// Update a menu item by ID
router.patch('/:id', updateMenuItem);
// Delete a menu item by ID
router.delete('/:id', deleteMenuItem);
// Reorder a menu item within its category
router.patch('/:id/reorder', reorderMenuItem);
export default router;
//# sourceMappingURL=menuItems.js.map