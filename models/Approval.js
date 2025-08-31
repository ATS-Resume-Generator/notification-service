const mongoose = require('mongoose');

const ApprovalSchema = new mongoose.Schema({
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  requester: String,
  approver: String,
  reason: String,
  decisionAt: Date,
  metadata: Object
}, { timestamps: true });

module.exports = mongoose.model('Approval', ApprovalSchema);
