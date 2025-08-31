const express = require('express');
const router = express.Router();
const { validateEmailNotification, validateWebhookNotification } = require('../middleware/validation');
const emailService = require('../services/emailService');
const webhookService = require('../services/webhookService');

router.post('/email', validateEmailNotification, emailService.queueEmailNotification);
router.post('/webhook', validateWebhookNotification, webhookService.queueWebhookNotification);

module.exports = router;
