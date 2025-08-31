const sgMail = require('../config/sendgrid');
const Notification = require('../models/Notification');
const Template = require('../models/Template');
const { notificationQueue } = require('../utils/queueManager');
const handlebars = require('handlebars');

async function queueEmailNotification(req, res, next) {
  try {
    const { to, templateName, data, scheduledAt } = req.body;
    const template = await Template.findOne({ name: templateName });
    if (!template) return res.status(404).json({ error: 'Template not found' });

    const notification = await Notification.create({
      type: 'email',
      to,
      payload: data,
      templateId: template._id,
      status: 'pending',
      scheduledAt
    });

    await notificationQueue.add('sendEmail', { notificationId: notification._id }, scheduledAt ? { delay: new Date(scheduledAt) - Date.now() } : {});

    res.status(202).json({ message: 'Email notification queued', id: notification._id });
  } catch (err) {
    next(err);
  }
}

async function processEmailNotification(job) {
  const { notificationId } = job.data;
  const notification = await Notification.findById(notificationId).populate('templateId');
  if (!notification) return;

  try {
    const template = notification.templateId;
    const html = handlebars.compile(template.html)(notification.payload);
    const text = template.text ? handlebars.compile(template.text)(notification.payload) : undefined;

    await sgMail.send({
      to: notification.to,
      from: process.env.EMAIL_FROM,
      subject: handlebars.compile(template.subject)(notification.payload),
      html,
      text
    });

    notification.status = 'sent';
    notification.sentAt = new Date();
    await notification.save();
  } catch (err) {
    notification.status = 'failed';
    notification.error = err.message;
    notification.attempts += 1;
    await notification.save();
    if (notification.attempts < 3) {
      await notificationQueue.add('sendEmail', { notificationId }, { delay: 60000 });
    }
  }
}

module.exports = {
  queueEmailNotification,
  processEmailNotification
};
