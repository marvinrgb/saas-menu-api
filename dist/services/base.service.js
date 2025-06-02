import { PrismaClient } from '@prisma/client';
export class BaseService {
    constructor(model) {
        this.prisma = new PrismaClient();
        this.model = model;
    }
    async findAll(params = {}) {
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
    async findById(id) {
        const item = await this.prisma[this.model].findUnique({
            where: { id },
        });
        if (!item) {
            throw new Error('Record not found');
        }
        return item;
    }
    async create(data) {
        return this.prisma[this.model].create({
            data: data,
        });
    }
    async update(id, data) {
        return this.prisma[this.model].update({
            where: { id },
            data: data,
        });
    }
    async delete(id) {
        return this.prisma[this.model].delete({
            where: { id },
        });
    }
}
//# sourceMappingURL=base.service.js.map