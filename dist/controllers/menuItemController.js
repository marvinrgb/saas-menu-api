import { PrismaClient, Prisma } from '@prisma/client';
import { z } from 'zod';
const prisma = new PrismaClient();
const createMenuItemSchema = z.object({
    name: z.string(),
    description: z.string().nullable().optional(),
    price: z.number(),
    isAvailable: z.boolean().optional().default(true),
    imageUrl: z.string().nullable().optional(),
    order: z.number().int().optional(),
    categoryId: z.string().cuid(),
});
const listMenuItemsQuerySchema = z.object({
    page: z.preprocess(Number, z.number().int().positive().default(1)),
    limit: z.preprocess(Number, z.number().int().positive().max(100).default(10)),
    categoryId: z.string().cuid().optional(),
    includeOptionGroups: z.preprocess(Boolean, z.boolean().optional().default(false)),
});
const getMenuItemByIdParamsSchema = z.object({
    id: z.string().cuid(),
});
const updateMenuItemParamsSchema = z.object({
    id: z.string().cuid(),
});
const updateMenuItemBodySchema = z.object({
    name: z.string().optional(),
    description: z.string().nullable().optional(),
    price: z.number().optional(),
    isAvailable: z.boolean().optional(),
    imageUrl: z.string().nullable().optional(),
    order: z.number().int().optional(),
    categoryId: z.string().cuid().optional(), // Allow changing category?
}).strict().partial(); // Allow partial updates and disallow unknown fields
const deleteMenuItemParamsSchema = z.object({
    id: z.string().cuid(),
});
const reorderMenuItemParamsSchema = z.object({
    id: z.string().cuid(),
});
const reorderMenuItemBodySchema = z.object({
    order: z.number().int().min(0),
});
export const listMenuItems = async (req, res, next) => {
    try {
        const { page, limit, categoryId, includeOptionGroups } = listMenuItemsQuerySchema.parse(req.query);
        const skip = (page - 1) * limit;
        const where = categoryId ? { categoryId } : {};
        const include = includeOptionGroups ? { optionGroups: true } : undefined;
        const [menuItems, total] = await prisma.$transaction([
            prisma.menuItem.findMany({
                skip,
                take: limit,
                where,
                include,
                orderBy: { order: 'asc' }, // Assuming menu items are ordered
            }),
            prisma.menuItem.count({ where }),
        ]);
        res.status(200).json({
            success: true,
            data: menuItems,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        });
    }
    catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ success: false, error: 'Validation Error', details: error.errors });
        }
        next(error); // Pass other errors to the error handler
    }
};
export const createMenuItem = async (req, res, next) => {
    try {
        const validatedData = createMenuItemSchema.parse(req.body);
        const menuItem = await prisma.menuItem.create({
            data: validatedData,
        });
        res.status(201).json({ success: true, data: menuItem });
    }
    catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ success: false, error: 'Validation Error', details: error.errors });
        }
        next(error); // Pass other errors to the error handler
    }
};
export const getMenuItemById = async (req, res, next) => {
    try {
        const { id } = getMenuItemByIdParamsSchema.parse(req.params);
        const menuItem = await prisma.menuItem.findUnique({
            where: { id },
            include: { optionGroups: true }, // Include option groups by default for detail view
        });
        if (!menuItem) {
            return res.status(404).json({ success: false, error: 'MenuItem not found' });
        }
        res.status(200).json({ success: true, data: menuItem });
    }
    catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ success: false, error: 'Validation Error', details: error.errors });
        }
        next(error); // Pass other errors to the error handler
    }
};
export const updateMenuItem = async (req, res, next) => {
    try {
        const { id } = updateMenuItemParamsSchema.parse(req.params);
        const validatedData = updateMenuItemBodySchema.parse(req.body);
        const updatedMenuItem = await prisma.menuItem.update({
            where: { id },
            data: validatedData,
        });
        res.status(200).json({ success: true, data: updatedMenuItem });
    }
    catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ success: false, error: 'Validation Error', details: error.errors });
        }
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2025') { // P2025: An operation failed because it depends on one or more records that were required but not found.
                return res.status(404).json({ success: false, error: 'MenuItem not found' });
            }
        }
        next(error); // Pass other errors to the error handler
    }
};
export const deleteMenuItem = async (req, res, next) => {
    try {
        const { id } = deleteMenuItemParamsSchema.parse(req.params);
        // Check if the menu item exists before attempting deletion
        const existingMenuItem = await prisma.menuItem.findUnique({
            where: { id },
        });
        if (!existingMenuItem) {
            return res.status(404).json({ success: false, error: 'MenuItem not found' });
        }
        await prisma.menuItem.delete({
            where: { id },
        });
        res.status(204).send(); // No content on successful deletion
    }
    catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ success: false, error: 'Validation Error', details: error.errors });
        }
        next(error); // Pass other errors to the error handler
    }
};
export const reorderMenuItem = async (req, res, next) => {
    try {
        const { id } = reorderMenuItemParamsSchema.parse(req.params);
        const { order } = reorderMenuItemBodySchema.parse(req.body);
        const updatedMenuItem = await prisma.menuItem.update({
            where: { id },
            data: { order },
        });
        res.status(200).json({ success: true, data: updatedMenuItem });
    }
    catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ success: false, error: 'Validation Error', details: error.errors });
        }
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2025') { // P2025: An operation failed because it depends on one or more records that were required but not found.
                return res.status(404).json({ success: false, error: 'MenuItem not found' });
            }
        }
        next(error); // Pass other errors to the error handler
    }
};
//# sourceMappingURL=menuItemController.js.map