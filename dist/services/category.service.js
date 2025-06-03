import { BaseService } from './base.service.js';
export class CategoryService extends BaseService {
    constructor() {
        super('Category');
    }
    async findAll(params = {}) {
        const { menuId, includeItems = false, ...paginationParams } = params;
        const { page = 1, limit = 10, sortBy = 'order', sortOrder = 'asc' } = paginationParams;
        const skip = (page - 1) * limit;
        const where = menuId ? { menuId } : {};
        const [total, items] = await Promise.all([
            this.prisma.category.count({ where }),
            this.prisma.category.findMany({
                where,
                skip,
                take: limit,
                orderBy: { [sortBy]: sortOrder },
                include: {
                    menuItems: includeItems ? {
                        include: {
                            optionGroups: {
                                include: {
                                    options: true
                                }
                            }
                        },
                        orderBy: {
                            order: 'asc'
                        }
                    } : undefined
                }
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
    async findById(id, includeItems = false) {
        const category = await this.prisma.category.findUnique({
            where: { id },
            include: {
                menuItems: includeItems ? {
                    include: {
                        optionGroups: {
                            include: {
                                options: true
                            }
                        }
                    },
                    orderBy: {
                        order: 'asc'
                    }
                } : undefined
            }
        });
        if (!category) {
            throw new Error('Category not found');
        }
        return category;
    }
    async create(data) {
        // If no order is provided, set it to the next available order number
        if (data.order === undefined) {
            const lastCategory = await this.prisma.category.findFirst({
                where: { menuId: data.menuId },
                orderBy: { order: 'desc' }
            });
            data.order = lastCategory ? lastCategory.order + 1 : 0;
        }
        return this.prisma.category.create({
            data,
        });
    }
    async update(id, data) {
        return this.prisma.category.update({
            where: { id },
            data,
            include: {
                menuItems: {
                    include: {
                        optionGroups: {
                            include: {
                                options: true
                            }
                        }
                    },
                    orderBy: {
                        order: 'asc'
                    }
                }
            }
        });
    }
    async delete(id) {
        // First check if category exists
        const category = await this.findById(id);
        if (!category) {
            throw new Error('Category not found');
        }
        // Delete the category (this will cascade delete menu items due to our schema)
        return this.prisma.category.delete({
            where: { id }
        });
    }
    async findByMenuId(menuId, includeItems = false) {
        const categories = await this.prisma.category.findMany({
            where: { menuId },
            include: {
                menuItems: includeItems ? {
                    include: {
                        optionGroups: {
                            include: {
                                options: true
                            }
                        }
                    },
                    orderBy: {
                        order: 'asc'
                    }
                } : undefined
            },
            orderBy: {
                order: 'asc'
            }
        });
        return categories;
    }
    async reorder(id, newOrder) {
        const category = await this.findById(id);
        if (!category) {
            throw new Error('Category not found');
        }
        // Get all categories in the same menu
        const categories = await this.prisma.category.findMany({
            where: { menuId: category.menuId },
            orderBy: { order: 'asc' }
        });
        // Update the order of all affected categories
        const updates = categories.map(cat => {
            let order = cat.order;
            if (cat.id === id) {
                order = newOrder;
            }
            else if (cat.order >= newOrder && cat.order < category.order) {
                order += 1;
            }
            else if (cat.order <= newOrder && cat.order > category.order) {
                order -= 1;
            }
            return this.prisma.category.update({
                where: { id: cat.id },
                data: { order }
            });
        });
        await this.prisma.$transaction(updates);
        return this.findById(id, true);
    }
}
//# sourceMappingURL=category.service.js.map