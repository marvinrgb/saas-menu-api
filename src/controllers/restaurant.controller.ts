import { Request, Response, NextFunction } from 'express';
import { RestaurantService } from '../services/restaurant.service.js';
import { ApiError, ApiResponse } from '../types/api.types.js';

export class RestaurantController {
  private service: RestaurantService;

  constructor() {
    this.service = new RestaurantService();
  }

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const restaurant = await this.service.create(req.body);
      const response: ApiResponse<typeof restaurant> = {
        success: true,
        data: restaurant
      };
      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  };

  findAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { page, limit, sortBy, sortOrder, includeMenus } = req.query;
      const result = await this.service.findAll({
        page: Number(page),
        limit: Number(limit),
        sortBy: sortBy as string,
        sortOrder: sortOrder as 'asc' | 'desc',
        includeMenus: includeMenus === 'true'
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
      const includeMenus = req.query.includeMenus === 'true';
      const restaurant = await this.service.findById(id, includeMenus);

      const response: ApiResponse<typeof restaurant> = {
        success: true,
        data: restaurant
      };
      res.json(response);
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const restaurant = await this.service.update(id, req.body);

      const response: ApiResponse<typeof restaurant> = {
        success: true,
        data: restaurant
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
} 