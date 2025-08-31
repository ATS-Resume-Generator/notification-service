const Approval = require('../models/Approval');

async function createApproval(req, res, next) {
  try {
    const { requester, approver, reason, metadata } = req.body;
    const approval = await Approval.create({ requester, approver, reason, metadata });
    res.status(201).json({ id: approval._id, status: approval.status });
  } catch (err) {
    next(err);
  }
}

async function getApprovalStatus(req, res, next) {
  try {
    const approval = await Approval.findById(req.params.id);
    if (!approval) return res.status(404).json({ error: 'Approval not found' });
    res.json({ id: approval._id, status: approval.status, decisionAt: approval.decisionAt });
  } catch (err) {
    next(err);
  }
}

async function approve(req, res, next) {
  try {
    const approval = await Approval.findById(req.params.id);
    if (!approval) return res.status(404).json({ error: 'Approval not found' });
    if (approval.status !== 'pending') return res.status(400).json({ error: 'Already decided' });
    approval.status = 'approved';
    approval.decisionAt = new Date();
    await approval.save();
    res.json({ id: approval._id, status: approval.status });
  } catch (err) {
    next(err);
  }
}

async function reject(req, res, next) {
  try {
    const approval = await Approval.findById(req.params.id);
    if (!approval) return res.status(404).json({ error: 'Approval not found' });
    if (approval.status !== 'pending') return res.status(400).json({ error: 'Already decided' });
    approval.status = 'rejected';
    approval.decisionAt = new Date();
    await approval.save();
    res.json({ id: approval._id, status: approval.status });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  createApproval,
  getApprovalStatus,
  approve,
  reject
};
