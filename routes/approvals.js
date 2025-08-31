const express = require('express');
const router = express.Router();
const approvalService = require('../services/approvalService');
const { validateApprovalCreate } = require('../middleware/validation');

router.post('/', validateApprovalCreate, approvalService.createApproval);
router.get('/:id', approvalService.getApprovalStatus);
router.post('/:id/approve', approvalService.approve);
router.post('/:id/reject', approvalService.reject);

module.exports = router;
