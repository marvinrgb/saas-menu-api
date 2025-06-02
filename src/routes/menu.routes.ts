import { Router } from 'express';
import { MenuController } from '../controllers/menu.controller.js';
import { validate } from '../middleware/validation.js';
import {
  createMenuSchema,
  updateMenuSchema,
  getMenuSchema,
  listMenusSchema,
  deleteMenuSchema,
  getRestaurantMenusSchema,
} from '../validation/menu.schema.js';

const router = Router();
const controller = new MenuController();

// Create a new menu
router.post(
  '/',
  validate(createMenuSchema),
  controller.create
);

// Get all menus with pagination
router.get(
  '/',
  validate(listMenusSchema),
  controller.findAll
);

// Get menus for a specific restaurant
router.get(
  '/restaurant/:restaurantId',
  validate(getRestaurantMenusSchema),
  controller.findByRestaurantId
);

// Get a specific menu by ID
router.get(
  '/:id',
  validate(getMenuSchema),
  controller.findById
);

// Update a menu
router.patch(
  '/:id',
  validate(updateMenuSchema),
  controller.update
);

// Delete a menu
router.delete(
  '/:id',
  validate(deleteMenuSchema),
  controller.delete
);

export default router; 