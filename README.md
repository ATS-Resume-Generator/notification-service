# Notification & Approval Microservice

A Node.js microservice for notification and approval workflows.

## Features

- Express.js REST API
- Email (SendGrid) & Webhook notifications
- Approval workflow management
- Email template system (Handlebars)
- Notification queuing (Bull + Redis)
- Delivery status tracking
- Input validation (Joi)
- MongoDB for persistence
- Docker-ready

## Setup

1. **Clone & Install**
   ```sh
   git clone <repo-url>
   cd notification-service
   npm install
   ```

2. **Configure Environment**
   - Copy `.env.example` to `.env` and fill in your values.

3. **Start MongoDB & Redis**
   - Ensure MongoDB and Redis are running (locally or via Docker).

4. **Run the Service**
   ```sh
   npm start
   ```

5. **Docker**
   ```sh
   docker build -t notification-service .
   docker run --env-file .env -p 3000:3000 notification-service
   ```

## API Endpoints

### Health
- `GET /health`

### Notifications
- `POST /notify/email` — Send email notification
- `POST /notify/webhook` — Send webhook notification

### Approvals
- `POST /approvals` — Create approval workflow
- `GET /approvals/:id` — Get approval status
- `POST /approvals/:id/approve` — Approve
- `POST /approvals/:id/reject` — Reject

### Templates
- `POST /templates` — Create notification template
- `GET /templates` — List templates

## Example Email Notification

```json
POST /notify/email
{
  "to": "user@example.com",
  "templateName": "welcome",
  "data": { "name": "Alice" }
}
```

## License

MIT
