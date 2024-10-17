import {
  ProductCreateRequest,
  ProductUpdateRequest,
  ProductGetAllRequest,
} from "@/src/controllers/types/product-request.type";
import { ProductTypes } from "@/src/types/product.type";
import ProductRepository from "@/src/database/repositories/product.repository";
// import { ProductResponse } from "../controllers/types/user-response.type";
export class ProductService {
  async getAllProducts(queries: ProductGetAllRequest) {
    try {
      const { page, limit, filter, sort } = queries;
      const newQueries = {
        // page,
        // limit,
        // filter:filter && JSON.parse(filter),
        // sort:sort && JSON.parse(sort)
        page: page ? parseInt(page, 1) : undefined,
        limit: limit ? parseInt(limit, 5) : undefined,
        filter: typeof filter === "string" ? JSON.parse(filter) : undefined,
        sort: typeof sort === "string" ? JSON.parse(sort) : undefined,
      };
      const result = await ProductRepository.getAll(newQueries);
      return result;
    } catch (error) {
      console.error(
        `ProductService - getAllProducts() method error : ${error}`
      );
      throw error;
    }
  }
  //get all product
  // public async getAllProduct(): Promise<ProductTypes[] | undefined> {
  //   try {
  //     const products = await ProductRepository.getAllProducts();
  //     return products;
  //   } catch (error) {
  //     throw error;
  //   }
  // }

  //get one product by id
  public async getOneProductById(
    id: string
  ): Promise<ProductTypes | undefined> {
    try {
      const products = await ProductRepository.getOneProductById(id);
      return products;
    } catch (error) {
      throw error;
    }
  }

  //create product
  public async createProduct(
    productRequest: ProductCreateRequest
  ): Promise<ProductTypes | undefined> {
    try {
      const newProduct = await ProductRepository.createProduct(productRequest);
      return newProduct;
    } catch (error) {
      console.log(`ProductService - createProduct() method error: ${error}`);
      throw error;
    }
  }

  //update product by id
  public async updateProductById(
    id: string,
    productRequest: ProductUpdateRequest
  ): Promise<ProductTypes | undefined> {
    try {
      const updateProduct = await ProductRepository.updateProductById(
        id,
        productRequest
      );
      return updateProduct;
    } catch (error) {
      throw error;
    }
  }
  //delete product by id
  public async deleteProductById(
    id: string
  ): Promise<ProductTypes | undefined> {
    try {
      const products = await ProductRepository.deleteProductById(id);
      return products;
    } catch (error) {
      throw error;
    }
  }
}

export default new ProductService();
