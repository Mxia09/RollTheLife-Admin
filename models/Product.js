import { Schema, model, models } from "mongoose";

const ProductSchema = new Schema({
    title: {type: String, req: true},
    description: String,
    price: {type: Number, req: true},
});

export const Product = models.Product || model('Product', ProductSchema)

