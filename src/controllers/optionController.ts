import { Request, Response, NextFunction } from 'express';
import { PrismaClient, Prisma } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

const createOptionSchema = z.object({
  name: z.string(),
  priceAdjustment: z.number(),
  isAvailable: z.boolean().optional().default(true),
  optionGroupId: z.string().cuid(), // Assuming optionGroupId is a cuid
});

const listOptionsQuerySchema = z.object({
  page: z.preprocess(Number, z.number().int().positive().default(1)),
  limit: z.preprocess(Number, z.number().int().positive().max(100).default(10)),
  optionGroupId: z.string().cuid().optional(),
});

const getOptionByIdParamsSchema = z.object({
  id: z.string().cuid(),
});

const updateOptionParamsSchema = z.object({
  id: z.string().cuid(),
});

const updateOptionBodySchema = z.object({
  name: z.string().optional(),
  priceAdjustment: z.number().optional(),
  isAvailable: z.boolean().optional(),
  optionGroupId: z.string().cuid().optional(), // Allow changing option group?
}).strict().partial(); // Allow partial updates and disallow unknown fields

const deleteOptionParamsSchema = z.object({
  id: z.string().cuid(),
});

export const listOptions = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page, limit, optionGroupId } = listOptionsQuerySchema.parse(req.query);
    const skip = (page - 1) * limit;

    const where = optionGroupId ? { optionGroupId } : {};

    const [options, total] = await prisma.$transaction([
      prisma.option.findMany({
        skip,
        take: limit,
        where,
        // Assuming options don't have a specific order field in the schema based on openapi.yaml
      }),
      prisma.option.count({ where }),
    ]);

    res.status(200).json({
      success: true,
      data: options,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ success: false, error: 'Validation Error', details: error.errors });
    }
    next(error); // Pass other errors to the error handler
  }
};

export const createOption = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedData = createOptionSchema.parse(req.body);

    const option = await prisma.option.create({
      data: validatedData,
    });

    res.status(201).json({ success: true, data: option });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ success: false, error: 'Validation Error', details: error.errors });
    }
    next(error); // Pass other errors to the error handler
  }
};

export const getOptionById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = getOptionByIdParamsSchema.parse(req.params);

    const option = await prisma.option.findUnique({
      where: { id },
    });

    if (!option) {
      return res.status(404).json({ success: false, error: 'Option not found' });
    }

    res.status(200).json({ success: true, data: option });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ success: false, error: 'Validation Error', details: error.errors });
    }
    next(error); // Pass other errors to the error handler
  }
};

export const updateOption = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = updateOptionParamsSchema.parse(req.params);
    const validatedData = updateOptionBodySchema.parse(req.body);

    const updatedOption = await prisma.option.update({
      where: { id },
      data: validatedData,
    });

    res.status(200).json({ success: true, data: updatedOption });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ success: false, error: 'Validation Error', details: error.errors });
    }
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') { // P2025: An operation failed because it depends on one or more records that were required but not found.
        return res.status(404).json({ success: false, error: 'Option not found' });
      }
    }
    next(error); // Pass other errors to the error handler
  }
};

export const deleteOption = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = deleteOptionParamsSchema.parse(req.params);

    // Check if the option exists before attempting deletion
    const existingOption = await prisma.option.findUnique({
      where: { id },
    });

    if (!existingOption) {
      return res.status(404).json({ success: false, error: 'Option not found' });
    }

    await prisma.option.delete({
      where: { id },
    });

    res.status(204).send(); // No content on successful deletion
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ success: false, error: 'Validation Error', details: error.errors });
    }
     if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') { // P2025: An operation failed because it depends on one or more records that were required but not found.
        return res.status(404).json({ success: false, error: 'Option not found' });
      }
    }
    next(error); // Pass other errors to the error handler
  }
}; 