import mongoose from 'mongoose';

const goldPriceSchema = new mongoose.Schema({
  price_per_gram: { type: Number, required: true, default: 6500 },
  updated_at: { type: Date, default: Date.now }
});

const GoldPrice = mongoose.model('GoldPrice', goldPriceSchema);
export default GoldPrice;
