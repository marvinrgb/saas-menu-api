import { Router } from 'express';
import { RestaurantController } from '../controllers/restaurant.controller.js';
import { validate } from '../middleware/validation.js';
import {
  createRestaurantSchema,
  updateRestaurantSchema,
  getRestaurantSchema,
  listRestaurantsSchema,
  deleteRestaurantSchema,
} from '../validation/restaurant.schema.js';

const router = Router();
const controller = new RestaurantController();

// Create a new restaurant
router.post(
  '/',
  validate(createRestaurantSchema),
  controller.create
);

// Get all restaurants with pagination
router.get(
  '/',
  validate(listRestaurantsSchema),
  controller.findAll
);

// Get a specific restaurant by ID
router.get(
  '/:id',
  validate(getRestaurantSchema),
  controller.findById
);

// Update a restaurant
router.patch(
  '/:id',
  validate(updateRestaurantSchema),
  controller.update
);

// Delete a restaurant
router.delete(
  '/:id',
  validate(deleteRestaurantSchema),
  controller.delete
);

export default router; 