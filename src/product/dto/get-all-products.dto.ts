import { IsNumber, IsPositive } from 'class-validator';

export class GetAllProductsDTO {
  categories?: string[];

  pageNumber?: number;

  pageSize?: number;
}
