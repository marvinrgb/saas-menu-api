import { Router } from 'express';
import { createOption, deleteOption, getOptionById, listOptions, updateOption } from '../controllers/optionController.js';
const router = Router();
// List options (potentially filtered by option group)
router.get('/', listOptions);
// Create a new option
router.post('/', createOption);
// Get an option by ID
router.get('/:id', getOptionById);
// Update an option by ID
router.patch('/:id', updateOption);
// Delete an option by ID
router.delete('/:id', deleteOption);
export default router;
//# sourceMappingURL=options.js.map