import { z } from 'zod';
export const createMenuSchema = z.object({
    body: z.object({
        name: z.string().min(1, 'Menu name is required'),
        description: z.string().optional(),
        isActive: z.boolean().default(true),
        restaurantId: z.string().min(1, 'Restaurant ID is required'),
    }),
});
export const updateMenuSchema = z.object({
    params: z.object({
        id: z.string().min(1, 'Menu ID is required'),
    }),
    body: z.object({
        name: z.string().min(1, 'Menu name is required').optional(),
        description: z.string().optional(),
        isActive: z.boolean().optional(),
    }),
});
export const getMenuSchema = z.object({
    params: z.object({
        id: z.string().min(1, 'Menu ID is required'),
    }),
    query: z.object({
        includeCategories: z.enum(['true', 'false']).optional(),
        includeItems: z.enum(['true', 'false']).optional(),
    }),
});
export const listMenusSchema = z.object({
    query: z.object({
        page: z.string().regex(/^\d+$/).transform(Number).optional(),
        limit: z.string().regex(/^\d+$/).transform(Number).optional(),
        sortBy: z.string().optional(),
        sortOrder: z.enum(['asc', 'desc']).optional(),
        restaurantId: z.string().optional(),
        includeCategories: z.enum(['true', 'false']).optional(),
        includeItems: z.enum(['true', 'false']).optional(),
    }),
});
export const deleteMenuSchema = z.object({
    params: z.object({
        id: z.string().min(1, 'Menu ID is required'),
    }),
});
export const getRestaurantMenusSchema = z.object({
    params: z.object({
        restaurantId: z.string().min(1, 'Restaurant ID is required'),
    }),
    query: z.object({
        includeCategories: z.enum(['true', 'false']).optional(),
        includeItems: z.enum(['true', 'false']).optional(),
    }),
});
//# sourceMappingURL=menu.schema.js.map