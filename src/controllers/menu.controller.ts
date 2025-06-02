import { Request, Response, NextFunction } from 'express';
import { MenuService } from '../services/menu.service.js';
import { ApiResponse } from '../types/api.types.js';

export class MenuController {
  private service: MenuService;

  constructor() {
    this.service = new MenuService();
  }

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const menu = await this.service.create(req.body);
      const response: ApiResponse<typeof menu> = {
        success: true,
        data: menu
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
        restaurantId,
        includeCategories,
        includeItems 
      } = req.query;

      const result = await this.service.findAll({
        page: Number(page),
        limit: Number(limit),
        sortBy: sortBy as string,
        sortOrder: sortOrder as 'asc' | 'desc',
        restaurantId: restaurantId as string,
        includeCategories: includeCategories === 'true',
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
      const { includeCategories, includeItems } = req.query;
      
      const menu = await this.service.findById(
        id,
        includeCategories === 'true',
        includeItems === 'true'
      );

      const response: ApiResponse<typeof menu> = {
        success: true,
        data: menu
      };
      res.json(response);
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const menu = await this.service.update(id, req.body);

      const response: ApiResponse<typeof menu> = {
        success: true,
        data: menu
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

  findByRestaurantId = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { restaurantId } = req.params;
      const { includeCategories, includeItems } = req.query;

      const menus = await this.service.findByRestaurantId(
        restaurantId,
        includeCategories === 'true',
        includeItems === 'true'
      );

      const response: ApiResponse<typeof menus> = {
        success: true,
        data: menus
      };
      res.json(response);
    } catch (error) {
      next(error);
    }
  };
} 