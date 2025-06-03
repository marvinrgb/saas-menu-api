import { Router } from 'express';
import { createSpecialOffer, deleteSpecialOffer, getSpecialOfferById, listSpecialOffers, updateSpecialOffer } from '../controllers/specialOfferController.js';
const router = Router();
// List special offers (potentially filtered by menu item)
router.get('/', listSpecialOffers);
// Create a new special offer
router.post('/', createSpecialOffer);
// Get a special offer by ID
router.get('/:id', getSpecialOfferById);
// Update a special offer by ID
router.patch('/:id', updateSpecialOffer);
// Delete a special offer by ID
router.delete('/:id', deleteSpecialOffer);
export default router;
//# sourceMappingURL=specialOffers.js.map