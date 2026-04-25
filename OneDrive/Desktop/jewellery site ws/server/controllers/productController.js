import Product from '../models/Product.js';
import GoldPrice from '../models/GoldPrice.js';

const calculateFinalPrice = (goldPrice, product) => {
  return (goldPrice.price_per_gram * product.weight) + product.making_charges;
};

const buildPriceBreakdown = (goldPrice, product) => {
  const goldValue = goldPrice.price_per_gram * product.weight;
  const finalPrice = goldValue + product.making_charges;
  return {
    goldPrice: goldPrice.price_per_gram,
    weight: product.weight,
    makingCharges: product.making_charges,
    calculatedValue: Math.round(goldValue),
    finalPrice: Math.round(finalPrice)
  };
};

const buildEstimatedRange = (finalPrice) => {
  const variance = finalPrice * 0.02;
  return {
    min: Math.round(finalPrice - variance),
    max: Math.round(finalPrice + variance)
  };
};

export const getProducts = async (req, res) => {
  try {
    const goldPrice = await GoldPrice.findOne();
    if (!goldPrice) return res.status(500).json({ error: 'Gold price not set' });

    const products = await Product.find();
    const productsWithPrice = products.map(p => {
      const obj = p.toObject();
      const breakdown = buildPriceBreakdown(goldPrice, p);
      obj.final_price = breakdown.finalPrice;
      obj.price_breakdown = breakdown;
      obj.estimated_range = buildEstimatedRange(breakdown.finalPrice);
      return obj;
    });
    res.json(productsWithPrice);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getProductById = async (req, res) => {
  try {
    const goldPrice = await GoldPrice.findOne();
    if (!goldPrice) return res.status(500).json({ error: 'Gold price not set' });

    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });

    const obj = product.toObject();
    const breakdown = buildPriceBreakdown(goldPrice, product);
    obj.final_price = breakdown.finalPrice;
    obj.price_breakdown = breakdown;
    obj.estimated_range = buildEstimatedRange(breakdown.finalPrice);
    obj.gold_price_last_updated = goldPrice.updated_at;
    res.json(obj);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const validateProductInput = (body) => {
  const errors = [];
  if (body.weight !== undefined && Number(body.weight) <= 0) errors.push('Weight must be greater than 0');
  if (body.making_charges !== undefined && Number(body.making_charges) < 0) errors.push('Making charges cannot be negative');
  return errors;
};

export const createProduct = async (req, res) => {
  try {
    const errors = validateProductInput(req.body);
    if (errors.length > 0) return res.status(400).json({ error: errors.join(', ') });
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const errors = validateProductInput(req.body);
    if (errors.length > 0) return res.status(400).json({ error: errors.join(', ') });
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
