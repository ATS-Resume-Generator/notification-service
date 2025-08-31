const Template = require('../models/Template');

async function createTemplate(req, res, next) {
  try {
    const { name, subject, html, text } = req.body;
    const template = await Template.create({ name, subject, html, text });
    res.status(201).json({ id: template._id });
  } catch (err) {
    if (err.code === 11000) return res.status(409).json({ error: 'Template name must be unique' });
    next(err);
  }
}

async function listTemplates(req, res, next) {
  try {
    const templates = await Template.find({}, 'name subject');
    res.json(templates);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  createTemplate,
  listTemplates
};
