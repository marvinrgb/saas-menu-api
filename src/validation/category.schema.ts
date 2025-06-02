import { z } from 'zod';

export const createCategorySchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Category name is required'),
    description: z.string().optional(),
    order: z.number().int().min(0).optional(),
    menuId: z.string().min(1, 'Menu ID is required'),
  }),
});

export const updateCategorySchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Category ID is required'),
  }),
  body: z.object({
    name: z.string().min(1, 'Category name is required').optional(),
    description: z.string().optional(),
    order: z.number().int().min(0).optional(),
  }),
});

export const getCategorySchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Category ID is required'),
  }),
  query: z.object({
    includeItems: z.enum(['true', 'false']).optional(),
  }),
});

export const listCategoriesSchema = z.object({
  query: z.object({
    page: z.string().regex(/^\d+$/).transform(Number).optional(),
    limit: z.string().regex(/^\d+$/).transform(Number).optional(),
    sortBy: z.string().optional(),
    sortOrder: z.enum(['asc', 'desc']).optional(),
    menuId: z.string().optional(),
    includeItems: z.enum(['true', 'false']).optional(),
  }),
});

export const deleteCategorySchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Category ID is required'),
  }),
});

export const getMenuCategoriesSchema = z.object({
  params: z.object({
    menuId: z.string().min(1, 'Menu ID is required'),
  }),
  query: z.object({
    includeItems: z.enum(['true', 'false']).optional(),
  }),
});

export const reorderCategorySchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Category ID is required'),
  }),
  body: z.object({
    order: z.number().int().min(0, 'Order must be a non-negative integer'),
  }),
}); 