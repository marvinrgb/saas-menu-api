import { Restaurant, Prisma } from '@prisma/client';
import { BaseService } from './base.service.js';
import { PaginationParams } from '../types/api.types.js';

export class RestaurantService extends BaseService<Restaurant> {
  constructor() {
    super('Restaurant');
  }

  async findAll(params: PaginationParams & { includeMenus?: boolean } = {}) {
    const { includeMenus = false, ...paginationParams } = params;
    
    const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' } = paginationParams;
    const skip = (page - 1) * limit;

    const [total, items] = await Promise.all([
      this.prisma.restaurant.count(),
      this.prisma.restaurant.findMany({
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        include: includeMenus ? {
          menus: true
        } : undefined
      }),
    ]);

    return {
      items,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findById(id: string, includeMenus: boolean = false) {
    const restaurant = await this.prisma.restaurant.findUnique({
      where: { id },
      include: includeMenus ? {
        menus: true
      } : undefined
    });

    if (!restaurant) {
      throw new Error('Restaurant not found');
    }

    return restaurant;
  }

  async create(data: Prisma.RestaurantCreateInput) {
    return this.prisma.restaurant.create({
      data,
      include: {
        menus: true
      }
    });
  }

  async update(id: string, data: Prisma.RestaurantUpdateInput) {
    return this.prisma.restaurant.update({
      where: { id },
      data,
      include: {
        menus: true
      }
    });
  }

  async delete(id: string) {
    // First check if restaurant exists
    const restaurant = await this.findById(id);
    if (!restaurant) {
      throw new Error('Restaurant not found');
    }

    // Delete the restaurant (this will cascade delete menus due to our schema)
    return this.prisma.restaurant.delete({
      where: { id }
    });
  }
} 