# Druth Digital ISP Subscription Platform

This project now includes a production-ready Express backend for internet subscription requests plus React-friendly frontend modules for pricing cards and a customer request form.

## What This Setup Does

- Displays residential and SME pricing plans
- Shows `₦70,000` residential installation as the standard one-time fee
- Shows `₦40,000` as a separate limited-time residential promo
- Lets a customer choose a plan and submit a request form
- Sends the full request to the company email
- Sends a confirmation email to the customer
- Optionally stores the request in MongoDB
- Exposes clean REST API routes for future admin dashboards

## Project Structure

```text
.
├── server.js
├── src-backend
│   ├── app.js
│   ├── config
│   │   ├── db.js
│   │   └── mailer.js
│   ├── constants
│   │   └── pricingPlans.js
│   ├── controllers
│   │   └── requestController.js
│   ├── middlewares
│   │   ├── errorHandler.js
│   │   ├── notFound.js
│   │   └── validateRequest.js
│   ├── models
│   │   └── SubscriptionRequest.js
│   ├── routes
│   │   └── requestRoutes.js
│   ├── services
│   │   └── subscriptionService.js
│   └── utils
│       ├── asyncHandler.js
│       ├── emailTemplates.js
│       └── formatters.js
├── src
│   ├── api
│   │   └── subscriptionApi.js
│   ├── components
│   │   ├── LoadingButton.jsx
│   │   ├── PlanCard.jsx
│   │   ├── PricingSection.jsx
│   │   └── SubscriptionRequestModal.jsx
│   ├── data
│   │   └── plans.js
│   ├── hooks
│   │   └── useSubscriptionRequest.js
│   ├── pages
│   │   ├── BroadbandPlans.jsx
│   │   └── Subscribe.jsx
│   └── styles
│       └── subscription.css
└── .env.example
```

## Backend API

### `GET /api/health`
Use this to confirm the backend is live.

### `GET /api/plans`
Returns the pricing data for residential and SME plans.

### `POST /api/subscription-requests`
Creates a new customer request, emails the admin, emails the customer, and stores the request in MongoDB when `MONGODB_URI` is configured.

Expected payload:

```json
{
  "fullName": "Jane Doe",
  "phoneNumber": "+2348012345678",
  "emailAddress": "jane@example.com",
  "homeAddress": "12 Admiralty Way, Lekki",
  "selectedPlan": {
    "planName": "Silver",
    "category": "Residential"
  },
  "preferredInstallationDate": "2026-05-28",
  "additionalMessage": "Please call before arrival."
}
```

### `GET /api/subscription-requests`
Returns all saved requests if MongoDB is enabled.

### `PATCH /api/subscription-requests/:id/status`
Updates request status. Supported values:

- `pending`
- `contacted`
- `scheduled`
- `completed`
- `cancelled`

## MongoDB Schema

The `SubscriptionRequest` model stores:

- Full name
- Phone number
- Email address
- Home address
- Selected plan details
- Preferred installation date
- Additional message
- Request status
- Created date
- Updated date

MongoDB is optional. If `MONGODB_URI` is missing, the app still sends emails and works in email-only mode.

## Email Flow

When a customer submits the form:

1. The frontend sends a `POST` request to `/api/subscription-requests`
2. Express validates the request
3. The backend enriches the plan data from the trusted pricing catalog
4. The request is saved to MongoDB if available
5. Nodemailer sends:
   - an admin email to `LEAD_NOTIFICATION_EMAIL`
   - a confirmation email to the customer
6. The frontend receives a success or error response and updates the UI

## Frontend Integration

The React integration is already scaffolded in `src/`.

### Key files

- `src/api/subscriptionApi.js`
  Handles API calls
- `src/hooks/useSubscriptionRequest.js`
  Manages form state, loading, success, and error states
- `src/components/PricingSection.jsx`
  Renders grouped residential and SME pricing cards
- `src/components/SubscriptionRequestModal.jsx`
  Displays the customer form in a modal
- `src/pages/BroadbandPlans.jsx`
  Connects the plan selection flow to the modal and API

### How frontend connects to backend

1. A user clicks `Subscribe Now` on a plan card
2. The selected plan is stored in React state
3. The modal opens and shows the selected plan summary
4. The user fills the form
5. `useSubscriptionRequest` calls `submitSubscriptionRequest`
6. `submitSubscriptionRequest` sends JSON to `POST /api/subscription-requests`
7. The backend responds with success or failure
8. The modal shows loading, success, or error feedback

## Environment Variables

Copy `.env.example` to `.env`.

### Required for backend startup

- `PORT`
- `CLIENT_ORIGIN`

### Required for email sending

- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_USER`
- `SMTP_PASS`
- `MAIL_FROM`
- `LEAD_NOTIFICATION_EMAIL`

### Optional

- `MONGODB_URI`
- `NODE_ENV`
- `RATE_LIMIT_MAX`
- `MONGODB_TIMEOUT_MS`

## Local Development

### 1. Install dependencies

```bash
npm install
```

### 2. Create your environment file

```bash
cp .env.example .env
```

On Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

### 3. Start MongoDB

If you want database storage, make sure MongoDB is running locally or use MongoDB Atlas.

### 4. Start the backend

```bash
npm run dev
```

### 5. Connect your React app

Set your frontend environment variable:

```env
VITE_API_BASE_URL=http://localhost:3000/api
```

Or for Create React App:

```env
REACT_APP_API_BASE_URL=http://localhost:3000/api
```

## Deployment Guide

### Backend

You can deploy the Express API to:

- Render
- Railway
- Fly.io
- VPS with PM2

### Frontend

You can deploy the React frontend to:

- Vercel
- Netlify
- Render static hosting

### Production checklist

1. Set `NODE_ENV=production`
2. Set `CLIENT_ORIGIN` to your real frontend domain
3. Use a real `MONGODB_URI`
4. Use a Gmail App Password or transactional email provider credentials
5. Add HTTPS on both frontend and backend
6. Test both admin and customer email flows

## Security Best Practices

- Use `helmet` to set secure HTTP headers
- Use `cors` to restrict allowed frontend origins
- Use `express-rate-limit` to reduce spam
- Never trust pricing from the frontend
- Rebuild plan pricing server-side from the backend plan catalog
- Keep `.env` out of git
- Rotate exposed SMTP credentials immediately
- Add CAPTCHA later if abuse becomes a problem
- Avoid exposing admin listing routes publicly in production without authentication

## Beginner-Friendly Notes

### Why the backend does not trust the plan amount from the browser

Anyone can change browser values in dev tools. The backend only accepts a plan name and category, then rebuilds the real monthly and installation fees from `src-backend/constants/pricingPlans.js`.

### Why MongoDB storage is optional

Some businesses want email only at first. This setup lets you launch with email delivery and add MongoDB without rewriting the request flow.

### Why there are both controller and service layers

- Controllers receive the request and return the response
- Services hold business logic like saving requests and sending emails

That separation keeps the code easier to maintain as the project grows.

## Next Good Improvements

- Add admin authentication for request management routes
- Add pagination and filters for request history
- Add resend or queue-based email delivery
- Add SMS or WhatsApp notifications for urgent leads
- Add dashboard analytics for plan demand
