import { Router } from 'express';
import { CategoryController } from '../controllers/category.controller.js';
import { validate } from '../middleware/validation.js';
import {
  createCategorySchema,
  updateCategorySchema,
  getCategorySchema,
  listCategoriesSchema,
  deleteCategorySchema,
  getMenuCategoriesSchema,
  reorderCategorySchema,
} from '../validation/category.schema.js';

const router = Router();
const controller = new CategoryController();

// Create a new category
router.post(
  '/',
  validate(createCategorySchema),
  controller.create
);

// Get all categories with pagination
router.get(
  '/',
  validate(listCategoriesSchema),
  controller.findAll
);

// Get categories for a specific menu
router.get(
  '/menu/:menuId',
  validate(getMenuCategoriesSchema),
  controller.findByMenuId
);

// Get a specific category by ID
router.get(
  '/:id',
  validate(getCategorySchema),
  controller.findById
);

// Update a category
router.patch(
  '/:id',
  validate(updateCategorySchema),
  controller.update
);

// Reorder a category
router.patch(
  '/:id/reorder',
  validate(reorderCategorySchema),
  controller.reorder
);

// Delete a category
router.delete(
  '/:id',
  validate(deleteCategorySchema),
  controller.delete
);

export default router; 