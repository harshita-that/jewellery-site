import mongoose from 'mongoose';

const enquirySchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  message: { type: String },
  created_at: { type: Date, default: Date.now }
});

const Enquiry = mongoose.model('Enquiry', enquirySchema);
export default Enquiry;
