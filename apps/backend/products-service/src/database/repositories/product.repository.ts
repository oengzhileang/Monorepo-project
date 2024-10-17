import ProductsModel from "@/src/database/models/products.model";
import { ProductTypes } from "@/src/types/product.type";
import {
  ProductCreateRequest,
  ProductUpdateRequest,
} from "@/src/controllers/types/product-request.type";
import {
  ProductGetAllRepoParams,
  ProductSortParams,
} from "@/src/database/repositories/types/product-repository.type";
import { SortOrder } from "mongoose";
import { NotFoundError } from "@/src/utils/error";
class ProductRepository {
  async getAll(queries: ProductGetAllRepoParams) {
    const {
      page = 1,
      limit = 5,
      filter = {},
      sort = { name: "desc" },
    } = queries;

    // Convert sort from {'field': 'desc'} to {'field': -1}
    const sortFields = Object.keys(sort).reduce((acc, key) => {
      const direction = sort[key as keyof ProductSortParams];
      if (direction === "asc" || direction === "desc") {
        acc[key as keyof ProductSortParams] = direction === "asc" ? 1 : -1;
      }
      return acc;
    }, {} as Record<keyof ProductSortParams, SortOrder>);

    // Build MongoDB filter object
    const buildFilter = (filter: Record<string, any>) => {
      const mongoFilter: Record<string, any> = {};
      for (const key in filter) {
        if (typeof filter[key] === "object") {
          if (
            filter[key].hasOwnProperty("min") ||
            filter[key].hasOwnProperty("max")
          ) {
            mongoFilter[key] = {};
            if (filter[key].min !== undefined) {
              mongoFilter[key].$gte = filter[key].min;
            }
            if (filter[key].max !== undefined) {
              mongoFilter[key].$lte = filter[key].max;
            }
          } else {
            mongoFilter[key] = filter[key];
          }
        } else {
          mongoFilter[key] = filter[key];
        }
      }
      return mongoFilter;
    };
    try {
      const mongoFilter = buildFilter(filter);
      console.log(mongoFilter);
      const operation = ProductsModel.find(mongoFilter)
        .sort(sortFields)
        .skip((page - 1) * limit)
        .limit(limit);

      const result = await operation;
      const totalItems = await ProductsModel.countDocuments(mongoFilter);

      return {
        [ProductsModel.collection.collectionName]: result,
        totalItems,
        totalPages: Math.ceil(totalItems / limit),
        currentPage: page,
      };
    } catch (error) {
      console.error(`ProductRepository - getAll() method error: ${error}`);
      throw error;
    }
  }

  //get all product
  // public async getAllProducts(): Promise<ProductTypes[] | undefined> {
  //   try {
  //     const products = await ProductsModel.find();
  //     if (!products) {
  //       throw new Error("Product not found");
  //     }
  //     return products;
  //   } catch (error) {
  //     throw error;
  //   }
  // }

  //get 1 product by id
  public async getOneProductById(
    id: string
  ): Promise<ProductTypes | undefined> {
    try {
      const products = await ProductsModel.findById(id);
      if (!products) {
        throw new NotFoundError({ message: "Product not found11" });
      }
      return products;
    } catch (error) {
      throw error;
    }
  }

  //create Product
  public async createProduct(
    productRequest: ProductCreateRequest
  ): Promise<ProductTypes | undefined> {
    try {
      const createProduct = await ProductsModel.create(productRequest);
      return createProduct;
    } catch (error) {
      throw error;
    }
  }

  //update product by id
  public async updateProductById(
    id: string,
    productRequest: ProductUpdateRequest
  ): Promise<ProductTypes | undefined> {
    try {
      const updateProduct = await ProductsModel.findByIdAndUpdate(
        id,
        productRequest,
        { new: true }
      );
      if (!updateProduct) {
        throw new NotFoundError({ message: "Product not found" });
      }
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
      const products = await ProductsModel.findByIdAndDelete(id);
      if (!products) {
        throw new NotFoundError({ message: "Product not found" });
      }
      return products;
    } catch (error) {
      throw error;
    }
  }
}

//add more method as need
export default new ProductRepository();
