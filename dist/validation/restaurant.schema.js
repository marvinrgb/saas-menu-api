import { z } from 'zod';
export const createRestaurantSchema = z.object({
    body: z.object({
        name: z.string().min(1, 'Restaurant name is required'),
        address: z.string().optional(),
        phone: z.string().optional(),
        email: z.string().email('Invalid email format').optional(),
        logoUrl: z.string().url('Invalid logo URL').optional(),
        qrCodeUrl: z.string().url('Invalid QR code URL').optional(),
        subscriptionStatus: z.enum(['free', 'basic', 'premium']).default('free'),
    }),
});
export const updateRestaurantSchema = z.object({
    params: z.object({
        id: z.string().min(1, 'Restaurant ID is required'),
    }),
    body: z.object({
        name: z.string().min(1, 'Restaurant name is required').optional(),
        address: z.string().optional(),
        phone: z.string().optional(),
        email: z.string().email('Invalid email format').optional(),
        logoUrl: z.string().url('Invalid logo URL').optional(),
        qrCodeUrl: z.string().url('Invalid QR code URL').optional(),
        subscriptionStatus: z.enum(['free', 'basic', 'premium']).optional(),
    }),
});
export const getRestaurantSchema = z.object({
    params: z.object({
        id: z.string().min(1, 'Restaurant ID is required'),
    }),
    query: z.object({
        includeMenus: z.enum(['true', 'false']).optional(),
    }),
});
export const listRestaurantsSchema = z.object({
    query: z.object({
        page: z.string().regex(/^\d+$/).transform(Number).optional(),
        limit: z.string().regex(/^\d+$/).transform(Number).optional(),
        sortBy: z.string().optional(),
        sortOrder: z.enum(['asc', 'desc']).optional(),
        includeMenus: z.enum(['true', 'false']).optional(),
    }),
});
export const deleteRestaurantSchema = z.object({
    params: z.object({
        id: z.string().min(1, 'Restaurant ID is required'),
    }),
});
//# sourceMappingURL=restaurant.schema.js.map