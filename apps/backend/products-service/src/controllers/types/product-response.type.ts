import { ProductTypes } from "@/src/types/product.type";

export interface ProductResponse {
  message: string;
  data: ProductTypes;
}

export interface ProductPaginatedResponse {
  message: string;
  data: {
    [key: string]: ProductTypes[] | number;
    totalProducts: number;
    totalPages: number;
    currentPage: number;
  };
}
