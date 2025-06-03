import { Request, Response, NextFunction } from 'express';
import { PrismaClient, Prisma } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

const createOptionGroupSchema = z.object({
  name: z.string(),
  isMultiSelect: z.boolean().optional().default(false),
  minSelections: z.number().int().min(0).optional().default(0),
  maxSelections: z.number().int().min(0).optional().default(0),
  order: z.number().int().min(0).optional(),
  menuItemId: z.string().cuid(), // Assuming menuItemId is a cuid
});

const listOptionGroupsQuerySchema = z.object({
  page: z.preprocess(Number, z.number().int().positive().default(1)),
  limit: z.preprocess(Number, z.number().int().positive().max(100).default(10)),
  menuItemId: z.string().cuid().optional(),
  includeOptions: z.preprocess(Boolean, z.boolean().optional().default(false)),
});

const getOptionGroupByIdParamsSchema = z.object({
  id: z.string().cuid(),
});

const updateOptionGroupParamsSchema = z.object({
  id: z.string().cuid(),
});

const updateOptionGroupBodySchema = z.object({
  name: z.string().optional(),
  isMultiSelect: z.boolean().optional(),
  minSelections: z.number().int().min(0).optional(),
  maxSelections: z.number().int().min(0).optional(),
  order: z.number().int().min(0).optional(),
}).strict().partial(); // Allow partial updates and disallow unknown fields

const deleteOptionGroupParamsSchema = z.object({
  id: z.string().cuid(),
});

const reorderOptionGroupParamsSchema = z.object({
  id: z.string().cuid(),
});

const reorderOptionGroupBodySchema = z.object({
  order: z.number().int().min(0),
});

export const listOptionGroups = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page, limit, menuItemId, includeOptions } = listOptionGroupsQuerySchema.parse(req.query);
    const skip = (page - 1) * limit;

    const where = menuItemId ? { menuItemId } : {};
    const include = includeOptions ? { options: true } : undefined;

    const [optionGroups, total] = await prisma.$transaction([
      prisma.optionGroup.findMany({
        skip,
        take: limit,
        where,
        include,
        orderBy: { order: 'asc' }, // Assuming option groups are ordered
      }),
      prisma.optionGroup.count({ where }),
    ]);

    res.status(200).json({
      success: true,
      data: optionGroups,
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

export const createOptionGroup = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedData = createOptionGroupSchema.parse(req.body);

    const optionGroup = await prisma.optionGroup.create({
      data: validatedData,
    });

    res.status(201).json({ success: true, data: optionGroup });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ success: false, error: 'Validation Error', details: error.errors });
    }
    next(error); // Pass other errors to the error handler
  }
};

export const getOptionGroupById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = getOptionGroupByIdParamsSchema.parse(req.params);

    const optionGroup = await prisma.optionGroup.findUnique({
      where: { id },
      include: { options: true }, // Include options by default for detail view
    });

    if (!optionGroup) {
      return res.status(404).json({ success: false, error: 'OptionGroup not found' });
    }

    res.status(200).json({ success: true, data: optionGroup });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ success: false, error: 'Validation Error', details: error.errors });
    }
    next(error); // Pass other errors to the error handler
  }
};

export const updateOptionGroup = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = updateOptionGroupParamsSchema.parse(req.params);
    const validatedData = updateOptionGroupBodySchema.parse(req.body);

    const updatedOptionGroup = await prisma.optionGroup.update({
      where: { id },
      data: validatedData,
    });

    res.status(200).json({ success: true, data: updatedOptionGroup });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ success: false, error: 'Validation Error', details: error.errors });
    }
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') { // P2025: An operation failed because it depends on one or more records that were required but not found.
        return res.status(404).json({ success: false, error: 'OptionGroup not found' });
      }
    }
    next(error); // Pass other errors to the error handler
  }
};

export const deleteOptionGroup = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = deleteOptionGroupParamsSchema.parse(req.params);

    // Check if the option group exists before attempting deletion
    const existingOptionGroup = await prisma.optionGroup.findUnique({
      where: { id },
    });

    if (!existingOptionGroup) {
      return res.status(404).json({ success: false, error: 'OptionGroup not found' });
    }

    await prisma.optionGroup.delete({
      where: { id },
    });

    res.status(204).send(); // No content on successful deletion
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ success: false, error: 'Validation Error', details: error.errors });
    }
    next(error); // Pass other errors to the error handler
  }
};

export const reorderOptionGroup = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = reorderOptionGroupParamsSchema.parse(req.params);
    const { order } = reorderOptionGroupBodySchema.parse(req.body);

    const updatedOptionGroup = await prisma.optionGroup.update({
      where: { id },
      data: { order },
    });

    res.status(200).json({ success: true, data: updatedOptionGroup });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ success: false, error: 'Validation Error', details: error.errors });
    }
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') { // P2025: An operation failed because it depends on one or more records that were required but not found.
        return res.status(404).json({ success: false, error: 'OptionGroup not found' });
      }
    }
    next(error); // Pass other errors to the error handler
  }
}; 