const Bull = require('bull');
const { processEmailNotification } = require('../services/emailService');
const { processWebhookNotification } = require('../services/webhookService');

const notificationQueue = new Bull('notifications', process.env.REDIS_URL);

notificationQueue.process('sendEmail', processEmailNotification);
notificationQueue.process('sendWebhook', processWebhookNotification);

module.exports = { notificationQueue };
