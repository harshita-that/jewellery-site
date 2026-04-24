import GoldPrice from '../models/GoldPrice.js';

export const getGoldPrice = async (req, res) => {
  try {
    let goldPrice = await GoldPrice.findOne();
    if (!goldPrice) {
      goldPrice = await GoldPrice.create({ price_per_gram: 6500 });
    }
    res.json({ price_per_gram: goldPrice.price_per_gram, updated_at: goldPrice.updated_at });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateGoldPrice = async (req, res) => {
  try {
    const { price_per_gram } = req.body;
    if (typeof price_per_gram !== 'number') {
      return res.status(400).json({ error: 'price_per_gram must be a number' });
    }
    let goldPrice = await GoldPrice.findOne();
    if (!goldPrice) {
      goldPrice = await GoldPrice.create({ price_per_gram });
    } else {
      goldPrice.price_per_gram = price_per_gram;
      goldPrice.updated_at = new Date();
      await goldPrice.save();
    }
    res.json({ price_per_gram: goldPrice.price_per_gram, updated_at: goldPrice.updated_at });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
