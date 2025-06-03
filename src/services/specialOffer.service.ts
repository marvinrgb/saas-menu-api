import { SpecialOffer, Prisma } from '@prisma/client';
import { BaseService } from './base.service.js';
import { PaginationParams } from '../types/api.types.js';

export class SpecialOfferService extends BaseService<SpecialOffer> {
  constructor() {
    super('SpecialOffer');
  }

  async findAll(params: PaginationParams & {
    menuItemId?: string;
  } = {}) {
    const {
      menuItemId,
      ...paginationParams
    } = params;

    const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' } = paginationParams;
    const skip = (page - 1) * limit;

    const where = menuItemId ? { menuItemId } : {};

    const [total, items] = await Promise.all([
      this.prisma.specialOffer.count({ where }),
      this.prisma.specialOffer.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
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

  async findById(id: string) {
    const specialOffer = await this.prisma.specialOffer.findUnique({
      where: { id },
    });

    if (!specialOffer) {
      throw new Error('Special Offer not found');
    }

    return specialOffer;
  }

  async create(data: Prisma.SpecialOfferCreateInput) {
    return this.prisma.specialOffer.create({
      data,
    });
  }

  async update(id: string, data: Prisma.SpecialOfferUpdateInput) {
    return this.prisma.specialOffer.update({
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    // First check if special offer exists
    const specialOffer = await this.findById(id);
    if (!specialOffer) {
      throw new Error('Special Offer not found');
    }

    // Delete the special offer
    return this.prisma.specialOffer.delete({
      where: { id }
    });
  }
} 