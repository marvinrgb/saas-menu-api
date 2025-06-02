import { BaseService } from './base.service.js';
export class MenuService extends BaseService {
    constructor() {
        super('Menu');
    }
    async findAll(params = {}) {
        const { restaurantId, includeCategories = false, includeItems = false, ...paginationParams } = params;
        const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' } = paginationParams;
        const skip = (page - 1) * limit;
        const where = restaurantId ? { restaurantId } : {};
        const [total, items] = await Promise.all([
            this.prisma.menu.count({ where }),
            this.prisma.menu.findMany({
                where,
                skip,
                take: limit,
                orderBy: { [sortBy]: sortOrder },
                include: {
                    categories: includeCategories ? {
                        include: includeItems ? {
                            menuItems: {
                                include: {
                                    optionGroups: {
                                        include: {
                                            options: true
                                        }
                                    }
                                }
                            }
                        } : undefined
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
    async findById(id, includeCategories = false, includeItems = false) {
        const menu = await this.prisma.menu.findUnique({
            where: { id },
            include: {
                categories: includeCategories ? {
                    include: includeItems ? {
                        menuItems: {
                            include: {
                                optionGroups: {
                                    include: {
                                        options: true
                                    }
                                }
                            }
                        }
                    } : undefined
                } : undefined
            }
        });
        if (!menu) {
            throw new Error('Menu not found');
        }
        return menu;
    }
    async create(data) {
        return this.prisma.menu.create({
            data,
            include: {
                categories: {
                    include: {
                        menuItems: {
                            include: {
                                optionGroups: {
                                    include: {
                                        options: true
                                    }
                                }
                            }
                        }
                    }
                }
            }
        });
    }
    async update(id, data) {
        return this.prisma.menu.update({
            where: { id },
            data,
            include: {
                categories: {
                    include: {
                        menuItems: {
                            include: {
                                optionGroups: {
                                    include: {
                                        options: true
                                    }
                                }
                            }
                        }
                    }
                }
            }
        });
    }
    async delete(id) {
        // First check if menu exists
        const menu = await this.findById(id);
        if (!menu) {
            throw new Error('Menu not found');
        }
        // Delete the menu (this will cascade delete categories due to our schema)
        return this.prisma.menu.delete({
            where: { id }
        });
    }
    async findByRestaurantId(restaurantId, includeCategories = false, includeItems = false) {
        const menus = await this.prisma.menu.findMany({
            where: { restaurantId },
            include: {
                categories: includeCategories ? {
                    include: includeItems ? {
                        menuItems: {
                            include: {
                                optionGroups: {
                                    include: {
                                        options: true
                                    }
                                }
                            }
                        }
                    } : undefined
                } : undefined
            }
        });
        return menus;
    }
}
//# sourceMappingURL=menu.service.js.map