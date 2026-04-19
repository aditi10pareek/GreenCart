const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  id: { type: Number },
  name: { type: String, required: true },
  weight: { type: String },
  price: { type: Number, required: true },
  category: { type: String, default: 'General' },
  image: { type: String },
  ecoScore: { type: Number },
  carbonSaved: { type: String },
  badge: { type: String },
  isGreen: { type: Boolean, default: false },
  description: { type: String },
  packaging: { type: String },
  material: { type: String },
  reusability: { type: String },
  certifications: [{ type: String }],
  carbonBreakdown: {
    manufacturing: { type: Number },
    packaging: { type: Number },
    delivery: { type: Number }
  },
  alternativeId: { type: Number }
});

module.exports = mongoose.model('Product', productSchema);
