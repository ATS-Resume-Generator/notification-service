const express = require('express');
const router = express.Router();
const templateEngine = require('../services/templateEngine');
const { validateTemplateCreate } = require('../middleware/validation');

router.post('/', validateTemplateCreate, templateEngine.createTemplate);
router.get('/', templateEngine.listTemplates);

module.exports = router;
