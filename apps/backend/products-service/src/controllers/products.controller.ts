import {
  ProductCreateRequest,
  ProductGetAllRequest,
  ProductUpdateRequest,
} from "./types/product-request.type";

import ProductsService from "@/src/services/products.service";
import validateRequest from "@/src/middlewares/validate-input";
import {
  ProductPaginatedResponse,
  ProductResponse,
} from "./types/product-response.type";
import ProductCreateSchema from "@/src/schemas/product.schema";
import {
  Route,
  Controller,
  Get,
  Queries,
  Path,
  Post,
  Middlewares,
  Body,
  Patch,
  Delete,
  Response,
} from "tsoa";

//change word in route need to start again

@Route("/v1/products")
export class ProductController extends Controller {
  // * get all products
  @Get()
  public async getAllProducts(
    @Queries() queries: ProductGetAllRequest
  ): Promise<ProductPaginatedResponse> {
    try {
      const products = await ProductsService.getAllProducts(queries);
      return {
        message: "Get all products successfully",
        data: {
          ...products,
          totalProducts: products.totalItems, // Ensure totalProducts is included
        },
      };
    } catch (error) {
      console.error(
        `ProductsController - getAllProducts() method error ${error}`
      );
      throw error;
    }
  }
  // @Get()
  // @Response(200, "Get all ata success")
  // public async getAllProducts() {
  //   try {
  //     const products = await ProductsService.getAllProduct();
  //     return {
  //       message: "Success",
  //       data: products,
  //     };
  //   } catch (error) {
  //     throw error;
  //   }
  // }

  //get one product by id
  @Get(`{id}`)
  @Response(200, "Get one success")
  public async getOneProductById(@Path() id: string): Promise<ProductResponse> {
    try {
      const products = await ProductsService.getOneProductById(id);

      return {
        message: "Get One Product by id Successfully",
        data: products!,
      };
    } catch (error) {
      throw error;
    }
  }

  //create Product
  @Post()
  @Response(201, "Create success")
  @Middlewares(validateRequest(ProductCreateSchema)) //local middleware
  public async createProduct(
    @Body() requestBody: ProductCreateRequest
  ): Promise<ProductResponse | undefined> {
    try {
      const newProduct = await ProductsService.createProduct(requestBody);
      return {
        message: "Success",
        data: {
          name: newProduct!.name,
          category: newProduct!.category,
          price: newProduct!.price,
          stock: newProduct!.stock,
        },
      };
    } catch (error) {
      throw error;
    }
  }

  //update product by id
  @Patch(`{id}`)
  public async updateProductById(
    @Path() id: string,
    @Body() requestBody: ProductUpdateRequest
  ) {
    try {
      const updateProduct = await ProductsService.updateProductById(
        id,
        requestBody
      );
      return { message: "Update success", data: updateProduct };
    } catch (error) {
      throw error;
    }
  }

  //delete product by id
  @Delete(`{id}`)
  @Response(204, "Delete success")
  public async deleteProductById(@Path() id: string) {
    try {
      const products = await ProductsService.deleteProductById(id);
      return {
        message: "Delete success",
        data: products,
      };
    } catch (error) {
      throw error;
    }
  }
}
