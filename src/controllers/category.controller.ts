import { Request, Response, NextFunction } from 'express';
import { CategoryService } from '../services/category.service.js';
import { ApiResponse } from '../types/api.types.js';

export class CategoryController {
  private service: CategoryService;

  constructor() {
    this.service = new CategoryService();
  }

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const category = await this.service.create(req.body);
      const response: ApiResponse<typeof category> = {
        success: true,
        data: category
      };
      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  };

  findAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { 
        page, 
        limit, 
        sortBy, 
        sortOrder, 
        menuId,
        includeItems 
      } = req.query;

      const result = await this.service.findAll({
        page: Number(page),
        limit: Number(limit),
        sortBy: sortBy as string,
        sortOrder: sortOrder as 'asc' | 'desc',
        menuId: menuId as string,
        includeItems: includeItems === 'true'
      });

      const response: ApiResponse<typeof result.items> = {
        success: true,
        data: result.items
      };

      res.json({
        ...response,
        pagination: result.pagination
      });
    } catch (error) {
      next(error);
    }
  };

  findById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const { includeItems } = req.query;
      
      const category = await this.service.findById(
        id,
        includeItems === 'true'
      );

      const response: ApiResponse<typeof category> = {
        success: true,
        data: category
      };
      res.json(response);
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const category = await this.service.update(id, req.body);

      const response: ApiResponse<typeof category> = {
        success: true,
        data: category
      };
      res.json(response);
    } catch (error) {
      next(error);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      await this.service.delete(id);

      const response: ApiResponse<null> = {
        success: true
      };
      res.status(204).json(response);
    } catch (error) {
      next(error);
    }
  };

  findByMenuId = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { menuId } = req.params;
      const { includeItems } = req.query;

      const categories = await this.service.findByMenuId(
        menuId,
        includeItems === 'true'
      );

      const response: ApiResponse<typeof categories> = {
        success: true,
        data: categories
      };
      res.json(response);
    } catch (error) {
      next(error);
    }
  };

  reorder = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const { order } = req.body;

      const category = await this.service.reorder(id, order);

      const response: ApiResponse<typeof category> = {
        success: true,
        data: category
      };
      res.json(response);
    } catch (error) {
      next(error);
    }
  };
} 