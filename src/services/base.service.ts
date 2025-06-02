import { PrismaClient, Prisma } from '@prisma/client';
import { PaginationParams } from '../types/api.types.js';

export class BaseService<T extends { id: string }> {
  protected prisma: PrismaClient;
  protected model: Prisma.ModelName;

  constructor(model: Prisma.ModelName) {
    this.prisma = new PrismaClient();
    this.model = model;
  }

  async findAll(params: PaginationParams = {}) {
    const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' } = params;
    const skip = (page - 1) * limit;

    const [total, items] = await Promise.all([
      this.prisma[this.model].count(),
      this.prisma[this.model].findMany({
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
    const item = await this.prisma[this.model].findUnique({
      where: { id },
    });

    if (!item) {
      throw new Error('Record not found');
    }

    return item;
  }

  async create(data: Omit<T, 'id'>) {
    return this.prisma[this.model].create({
      data: data as any,
    });
  }

  async update(id: string, data: Partial<Omit<T, 'id'>>) {
    return this.prisma[this.model].update({
      where: { id },
      data: data as any,
    });
  }

  async delete(id: string) {
    return this.prisma[this.model].delete({
      where: { id },
    });
  }
} 