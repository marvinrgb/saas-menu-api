import { RestaurantService } from '../services/restaurant.service.js';
export class RestaurantController {
    constructor() {
        this.create = async (req, res, next) => {
            try {
                const restaurant = await this.service.create(req.body);
                const response = {
                    success: true,
                    data: restaurant
                };
                res.status(201).json(response);
            }
            catch (error) {
                next(error);
            }
        };
        this.findAll = async (req, res, next) => {
            try {
                const { page, limit, sortBy, sortOrder, includeMenus } = req.query;
                const result = await this.service.findAll({
                    page: Number(page),
                    limit: Number(limit),
                    sortBy: sortBy,
                    sortOrder: sortOrder,
                    includeMenus: includeMenus === 'true'
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
                const includeMenus = req.query.includeMenus === 'true';
                const restaurant = await this.service.findById(id, includeMenus);
                const response = {
                    success: true,
                    data: restaurant
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
                const restaurant = await this.service.update(id, req.body);
                const response = {
                    success: true,
                    data: restaurant
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
        this.service = new RestaurantService();
    }
}
//# sourceMappingURL=restaurant.controller.js.map