const mongoose = require('mongoose');

const TemplateSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  subject: String,
  html: String,
  text: String
}, { timestamps: true });

module.exports = mongoose.model('Template', TemplateSchema);
