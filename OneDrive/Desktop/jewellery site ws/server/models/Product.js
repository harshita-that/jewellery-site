import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  weight: {
    type: Number,
    required: true,
    validate: {
      validator: (v) => v > 0,
      message: 'Weight must be greater than 0'
    }
  },
  making_charges: {
    type: Number,
    required: true,
    validate: {
      validator: (v) => v >= 0,
      message: 'Making charges cannot be negative'
    }
  },
  image_url: { type: String },
  hover_image_url: { type: String },
  category: { type: String, required: true },
  description: { type: String }
});

const Product = mongoose.model('Product', productSchema);
export default Product;
