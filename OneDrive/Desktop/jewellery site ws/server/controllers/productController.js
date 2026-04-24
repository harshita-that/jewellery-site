import Product from '../models/Product.js';
import GoldPrice from '../models/GoldPrice.js';

const calculateFinalPrice = (goldPrice, product) => {
  return (goldPrice.price_per_gram * product.weight) + product.making_charges;
};

export const getProducts = async (req, res) => {
  try {
    const goldPrice = await GoldPrice.findOne();
    if (!goldPrice) return res.status(500).json({ error: 'Gold price not set' });

    const products = await Product.find();
    const productsWithPrice = products.map(p => {
      const obj = p.toObject();
      obj.final_price = calculateFinalPrice(goldPrice, p);
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
    obj.final_price = calculateFinalPrice(goldPrice, product);
    res.json(obj);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
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
