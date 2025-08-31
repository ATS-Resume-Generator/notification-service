const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
  type: { type: String, enum: ['email', 'webhook'], required: true },
  to: String,
  payload: Object,
  templateId: { type: mongoose.Schema.Types.ObjectId, ref: 'Template' },
  status: { type: String, enum: ['pending', 'sent', 'failed'], default: 'pending' },
  error: String,
  attempts: { type: Number, default: 0 },
  scheduledAt: Date,
  sentAt: Date
}, { timestamps: true });

module.exports = mongoose.model('Notification', NotificationSchema);
