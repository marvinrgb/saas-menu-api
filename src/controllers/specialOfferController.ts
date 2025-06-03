import { Request, Response, NextFunction } from 'express';
import { SpecialOfferService } from '../services/specialOffer.service.js';
import { z } from 'zod';
import { Prisma } from '@prisma/client';
import { PaginationParams } from '../types/api.types.js';

const specialOfferService = new SpecialOfferService();

const createSpecialOfferSchema = z.object({
  name: z.string(),
  description: z.string().nullable().optional(),
  offerType: z.string(),
  priceAdjustment: z.number(),
  startTime: z.string().datetime(), // Assuming ISO 8601 string format
  endTime: z.string().datetime(), // Assuming ISO 8601 string format
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

export const listSpecialOffers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedQuery = listSpecialOffersQuerySchema.parse(req.query);

    const result = await specialOfferService.findAll({
      page: validatedQuery.page,
      limit: validatedQuery.limit,
      menuItemId: validatedQuery.menuItemId,
      sortBy: validatedQuery.sortBy, // Assuming sortBy and sortOrder are part of PaginationParams
      sortOrder: validatedQuery.sortOrder, // Assuming sortBy and sortOrder are part of PaginationParams
    } as PaginationParams & { menuItemId?: string });

    res.status(200).json({
      success: true,
      data: result.items,
      pagination: result.pagination,
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ success: false, error: 'Validation Error', details: error.errors });
    }
    next(error); // Pass other errors to the error handler
  }
};

export const createSpecialOffer = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedData = createSpecialOfferSchema.parse(req.body);

    // Convert date strings to Date objects for Prisma
    const specialOfferData: Prisma.SpecialOfferCreateInput = {
      ...validatedData,
      startTime: new Date(validatedData.startTime),
      endTime: new Date(validatedData.endTime),
    };

    const specialOffer = await specialOfferService.create(specialOfferData);

    res.status(201).json({ success: true, data: specialOffer });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ success: false, error: 'Validation Error', details: error.errors });
    }
    next(error); // Pass other errors to the error handler
  }
};

export const getSpecialOfferById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = getSpecialOfferByIdParamsSchema.parse(req.params);

    const specialOffer = await specialOfferService.findById(id);

    res.status(200).json({ success: true, data: specialOffer });
  } catch (error: any) {
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

export const updateSpecialOffer = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = updateSpecialOfferParamsSchema.parse(req.params);
    const validatedData = updateSpecialOfferBodySchema.parse(req.body);

    // Convert date strings to Date objects if they exist in validatedData
    const updateData: Prisma.SpecialOfferUpdateInput = {
      ...validatedData,
      ...(validatedData.startTime && { startTime: new Date(validatedData.startTime) }),
      ...(validatedData.endTime && { endTime: new Date(validatedData.endTime) }),
    };

    const updatedSpecialOffer = await specialOfferService.update(id, updateData);

    res.status(200).json({ success: true, data: updatedSpecialOffer });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ success: false, error: 'Validation Error', details: error.errors });
    }
    if (error.message === 'Special Offer not found') {
      return res.status(404).json({ success: false, error: error.message });
    }
    next(error); // Pass other errors to the error handler
  }
};

export const deleteSpecialOffer = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = deleteSpecialOfferParamsSchema.parse(req.params);

    await specialOfferService.delete(id);

    res.status(204).send(); // 204 No Content for successful deletion
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ success: false, error: 'Validation Error', details: error.errors });
    }
    if (error.message === 'Special Offer not found') {
      return res.status(404).json({ success: false, error: error.message });
    }
    next(error); // Pass other errors to the error handler
  }
}; 