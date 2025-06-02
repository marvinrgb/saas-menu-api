import { MenuService } from '../services/menu.service.js';
export class MenuController {
    constructor() {
        this.create = async (req, res, next) => {
            try {
                const menu = await this.service.create(req.body);
                const response = {
                    success: true,
                    data: menu
                };
                res.status(201).json(response);
            }
            catch (error) {
                next(error);
            }
        };
        this.findAll = async (req, res, next) => {
            try {
                const { page, limit, sortBy, sortOrder, restaurantId, includeCategories, includeItems } = req.query;
                const result = await this.service.findAll({
                    page: Number(page),
                    limit: Number(limit),
                    sortBy: sortBy,
                    sortOrder: sortOrder,
                    restaurantId: restaurantId,
                    includeCategories: includeCategories === 'true',
                    includeItems: includeItems === 'true'
                });
                const response = {
                    success: true,
                    data: result.items
                };
                res.json({
                    ...response,
                    pagination: result.pagination
                });
            }
            catch (error) {
                next(error);
            }
        };
        this.findById = async (req, res, next) => {
            try {
                const { id } = req.params;
                const { includeCategories, includeItems } = req.query;
                const menu = await this.service.findById(id, includeCategories === 'true', includeItems === 'true');
                const response = {
                    success: true,
                    data: menu
                };
                res.json(response);
            }
            catch (error) {
                next(error);
            }
        };
        this.update = async (req, res, next) => {
            try {
                const { id } = req.params;
                const menu = await this.service.update(id, req.body);
                const response = {
                    success: true,
                    data: menu
                };
                res.json(response);
            }
            catch (error) {
                next(error);
            }
        };
        this.delete = async (req, res, next) => {
            try {
                const { id } = req.params;
                await this.service.delete(id);
                const response = {
                    success: true
                };
                res.status(204).json(response);
            }
            catch (error) {
                next(error);
            }
        };
        this.findByRestaurantId = async (req, res, next) => {
            try {
                const { restaurantId } = req.params;
                const { includeCategories, includeItems } = req.query;
                const menus = await this.service.findByRestaurantId(restaurantId, includeCategories === 'true', includeItems === 'true');
                const response = {
                    success: true,
                    data: menus
                };
                res.json(response);
            }
            catch (error) {
                next(error);
            }
        };
        this.service = new MenuService();
    }
}
//# sourceMappingURL=menu.controller.js.map