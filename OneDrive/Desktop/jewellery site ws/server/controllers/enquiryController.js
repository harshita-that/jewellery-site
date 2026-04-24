import Enquiry from '../models/Enquiry.js';

export const createEnquiry = async (req, res) => {
  try {
    const { name, phone, message } = req.body;
    if (!name || !phone) {
      return res.status(400).json({ error: 'Name and phone are required' });
    }
    const enquiry = await Enquiry.create({ name, phone, message });
    res.status(201).json(enquiry);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
