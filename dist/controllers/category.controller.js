import { CategoryService } from '../services/category.service.js';
export class CategoryController {
    constructor() {
        this.create = async (req, res, next) => {
            try {
                const category = await this.service.create(req.body);
                const response = {
                    success: true,
                    data: category
                };
                res.status(201).json(response);
            }
            catch (error) {
                next(error);
            }
        };
        this.findAll = async (req, res, next) => {
            try {
                const { page, limit, sortBy, sortOrder, menuId, includeItems } = req.query;
                const result = await this.service.findAll({
                    page: Number(page),
                    limit: Number(limit),
                    sortBy: sortBy,
                    sortOrder: sortOrder,
                    menuId: menuId,
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
                const { includeItems } = req.query;
                const category = await this.service.findById(id, includeItems === 'true');
                const response = {
                    success: true,
                    data: category
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
                const category = await this.service.update(id, req.body);
                const response = {
                    success: true,
                    data: category
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
        this.findByMenuId = async (req, res, next) => {
            try {
                const { menuId } = req.params;
                const { includeItems } = req.query;
                const categories = await this.service.findByMenuId(menuId, includeItems === 'true');
                const response = {
                    success: true,
                    data: categories
                };
                res.json(response);
            }
            catch (error) {
                next(error);
            }
        };
        this.reorder = async (req, res, next) => {
            try {
                const { id } = req.params;
                const { order } = req.body;
                const category = await this.service.reorder(id, order);
                const response = {
                    success: true,
                    data: category
                };
                res.json(response);
            }
            catch (error) {
                next(error);
            }
        };
        this.service = new CategoryService();
    }
}
//# sourceMappingURL=category.controller.js.map