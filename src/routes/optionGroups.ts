import { Router } from 'express';
import { createOptionGroup, deleteOptionGroup, getOptionGroupById, listOptionGroups, updateOptionGroup, reorderOptionGroup } from '../controllers/optionGroupController.js';

const router = Router();

// List option groups (potentially filtered by menu item)
router.get('/', listOptionGroups);

// Create a new option group
router.post('/', createOptionGroup);

// Get an option group by ID
router.get('/:id', getOptionGroupById);

// Update an option group by ID
router.patch('/:id', updateOptionGroup);

// Delete an option group by ID
router.delete('/:id', deleteOptionGroup);

// Reorder an option group within its menu item
router.patch('/:id/reorder', reorderOptionGroup);

export default router; 