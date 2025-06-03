import { SpecialOfferService } from '../services/specialOffer.service.js';
import { z } from 'zod';
const specialOfferService = new SpecialOfferService();
const createSpecialOfferSchema = z.object({
    name: z.string(),
    description: z.string().nullable().optional(),
    offerType: z.string(),
    priceAdjustment: z.number(),
    startTime: z.string().datetime(),
    endTime: z.string().datetime(),
    isActive: z.boolean().optional().default(true),
    menuItemId: z.string().cuid().nullable().optional(),
});
const listSpecialOffersQuerySchema = z.object({
    page: z.preprocess(Number, z.number().int().positive().default(1)),
    limit: z.preprocess(Number, z.number().int().positive().max(100).default(10)),
    menuItemId: z.string().cuid().optional(),
});
const getSpecialOfferByIdParamsSchema = z.object({
    id: z.string().cuid(),
});
const updateSpecialOfferParamsSchema = z.object({
    id: z.string().cuid(),
});
const updateSpecialOfferBodySchema = createSpecialOfferSchema.partial();
const deleteSpecialOfferParamsSchema = z.object({
    id: z.string().cuid(),
});
export const listSpecialOffers = async (req, res, next) => {
    try {
        const validatedQuery = listSpecialOffersQuerySchema.parse(req.query);
        const result = await specialOfferService.findAll({
            page: validatedQuery.page,
            limit: validatedQuery.limit,
            menuItemId: validatedQuery.menuItemId,
            sortBy: validatedQuery.sortBy,
            sortOrder: validatedQuery.sortOrder, // Assuming sortBy and sortOrder are part of PaginationParams
        });
        res.status(200).json({
            success: true,
            data: result.items,
            pagination: result.pagination,
        });
    }
    catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ success: false, error: 'Validation Error', details: error.errors });
        }
        next(error); // Pass other errors to the error handler
    }
};
export const createSpecialOffer = async (req, res, next) => {
    try {
        const validatedData = createSpecialOfferSchema.parse(req.body);
        // Convert date strings to Date objects for Prisma
        const specialOfferData = {
            ...validatedData,
            startTime: new Date(validatedData.startTime),
            endTime: new Date(validatedData.endTime),
        };
        const specialOffer = await specialOfferService.create(specialOfferData);
        res.status(201).json({ success: true, data: specialOffer });
    }
    catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ success: false, error: 'Validation Error', details: error.errors });
        }
        next(error); // Pass other errors to the error handler
    }
};
export const getSpecialOfferById = async (req, res, next) => {
    try {
        const { id } = getSpecialOfferByIdParamsSchema.parse(req.params);
        const specialOffer = await specialOfferService.findById(id);
        res.status(200).json({ success: true, data: specialOffer });
    }
    catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ success: false, error: 'Validation Error', details: error.errors });
        }
        // Assuming findById throws an error if not found, which BaseService does
        if (error.message === 'Special Offer not found') {
            return res.status(404).json({ success: false, error: error.message });
        }
        next(error); // Pass other errors to the error handler
    }
};
export const updateSpecialOffer = async (req, res, next) => {
    try {
        const { id } = updateSpecialOfferParamsSchema.parse(req.params);
        const validatedData = updateSpecialOfferBodySchema.parse(req.body);
        // Convert date strings to Date objects if they exist in validatedData
        const updateData = {
            ...validatedData,
            ...(validatedData.startTime && { startTime: new Date(validatedData.startTime) }),
            ...(validatedData.endTime && { endTime: new Date(validatedData.endTime) }),
        };
        const updatedSpecialOffer = await specialOfferService.update(id, updateData);
        res.status(200).json({ success: true, data: updatedSpecialOffer });
    }
    catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ success: false, error: 'Validation Error', details: error.errors });
        }
        if (error.message === 'Special Offer not found') {
            return res.status(404).json({ success: false, error: error.message });
        }
        next(error); // Pass other errors to the error handler
    }
};
export const deleteSpecialOffer = async (req, res, next) => {
    try {
        const { id } = deleteSpecialOfferParamsSchema.parse(req.params);
        await specialOfferService.delete(id);
        res.status(204).send(); // 204 No Content for successful deletion
    }
    catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ success: false, error: 'Validation Error', details: error.errors });
        }
        if (error.message === 'Special Offer not found') {
            return res.status(404).json({ success: false, error: error.message });
        }
        next(error); // Pass other errors to the error handler
    }
};
//# sourceMappingURL=specialOfferController.js.map