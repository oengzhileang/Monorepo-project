import { Schema, model } from "mongoose";

import { ProductTypes } from "@/src/types/product.type";

// Schema definition
const ProductSchema = new Schema({
  name: { type: String, require: true },
  category: { type: String, require: true },
  price: { type: Number, require: true },
  stock: { type: Number, require: true },
});

// Create a model from the schema
const ProductsModel = model<ProductTypes>("testing", ProductSchema);

export default ProductsModel;
