const axios = require('axios');
const Notification = require('../models/Notification');
const { notificationQueue } = require('../utils/queueManager');

async function queueWebhookNotification(req, res, next) {
  try {
    const { url, payload, scheduledAt } = req.body;
    const notification = await Notification.create({
      type: 'webhook',
      to: url,
      payload,
      status: 'pending',
      scheduledAt
    });

    await notificationQueue.add('sendWebhook', { notificationId: notification._id }, scheduledAt ? { delay: new Date(scheduledAt) - Date.now() } : {});

    res.status(202).json({ message: 'Webhook notification queued', id: notification._id });
  } catch (err) {
    next(err);
  }
}

async function processWebhookNotification(job) {
  const { notificationId } = job.data;
  const notification = await Notification.findById(notificationId);
  if (!notification) return;

  try {
    await axios.post(notification.to, notification.payload);
    notification.status = 'sent';
    notification.sentAt = new Date();
    await notification.save();
  } catch (err) {
    notification.status = 'failed';
    notification.error = err.message;
    notification.attempts += 1;
    await notification.save();
    if (notification.attempts < 3) {
      await notificationQueue.add('sendWebhook', { notificationId }, { delay: 60000 });
    }
  }
}

module.exports = {
  queueWebhookNotification,
  processWebhookNotification
};
