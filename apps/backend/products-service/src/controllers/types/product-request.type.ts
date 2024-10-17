export interface ProductCreateRequest {
  name: string;
  category: string;
  price: number;
  stock: number;
}

export interface ProductUpdateRequest {
  name?: string;
  category?: string;
  price?: number;
  stock?: number;
}

export interface ProductGetAllRequest {
  page?: string;
  limit?: string;
  filter?: string;
  sort?: string;
}
