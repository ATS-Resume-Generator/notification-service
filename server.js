require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('./config/database');
const { errorHandler } = require('./middleware/validation');
const notificationRoutes = require('./routes/notifications');
const approvalRoutes = require('./routes/approvals');
const templateRoutes = require('./routes/templates');
const { setQueues, UI } = require('bull-board');
const { notificationQueue } = require('./utils/queueManager');

const app = express();

app.use(cors());
app.use(express.json());

setQueues([notificationQueue]);

app.use('/health', (req, res) => res.json({ status: 'ok' }));
app.use('/notify', notificationRoutes);
app.use('/approvals', approvalRoutes);
app.use('/templates', templateRoutes);
app.use('/admin/queues', UI);

app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Notification service running on port ${PORT}`);
});
