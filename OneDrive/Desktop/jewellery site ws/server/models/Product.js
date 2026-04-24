import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  weight: { type: Number, required: true },
  making_charges: { type: Number, required: true },
  image_url: { type: String },
  hover_image_url: { type: String },
  category: { type: String, required: true },
  description: { type: String }
});

const Product = mongoose.model('Product', productSchema);
export default Product;
