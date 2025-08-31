const Joi = require('joi');

const emailNotificationSchema = Joi.object({
  to: Joi.string().email().required(),
  templateName: Joi.string().required(),
  data: Joi.object().required(),
  scheduledAt: Joi.date().optional()
});

const webhookNotificationSchema = Joi.object({
  url: Joi.string().uri().required(),
  payload: Joi.object().required(),
  scheduledAt: Joi.date().optional()
});

const approvalCreateSchema = Joi.object({
  requester: Joi.string().required(),
  approver: Joi.string().required(),
  reason: Joi.string().optional(),
  metadata: Joi.object().optional()
});

const templateCreateSchema = Joi.object({
  name: Joi.string().required(),
  subject: Joi.string().required(),
  html: Joi.string().required(),
  text: Joi.string().optional()
});

function validate(schema) {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });
    next();
  };
}

const validateEmailNotification = validate(emailNotificationSchema);
const validateWebhookNotification = validate(webhookNotificationSchema);
const validateApprovalCreate = validate(approvalCreateSchema);
const validateTemplateCreate = validate(templateCreateSchema);

function errorHandler(err, req, res, next) {
  console.error(err);
  res.status(500).json({ error: err.message || 'Internal server error' });
}

module.exports = {
  validateEmailNotification,
  validateWebhookNotification,
  validateApprovalCreate,
  validateTemplateCreate,
  errorHandler
};
