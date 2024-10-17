import Joi from "joi";
const ProductCreateSchema = Joi.object({
  name: Joi.string().required().min(3).max(20),
  category: Joi.string().required(),
  price: Joi.number().required().integer().min(0).positive(),
  stock: Joi.number().required().integer().min(0).positive(),
});

export default ProductCreateSchema;
