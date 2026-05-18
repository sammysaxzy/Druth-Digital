# cPanel / Truehost Deployment Guide

This guide is tailored for the Druth Digital project and assumes you are using:

- React frontend
- Node.js + Express backend
- MongoDB Atlas or another external MongoDB server
- cPanel hosting on Truehost

## Before You Deploy

Prepare two parts:

1. Frontend build files
2. Backend Node.js application

## Recommended Production Layout

Use a setup like this on your hosting account:

```text
home/
├── druth-backend/
│   ├── server.js
│   ├── package.json
│   ├── src-backend/
│   ├── .env
│   └── public/
└── public_html/
    └── druth/
        ├── index.html
        ├── assets/
        └── ...
```

If you want the API on a subdomain, a cleaner setup is:

- Frontend: `https://druthdigital.com`
- Backend: `https://api.druthdigital.com`

## Part 1: Deploy the React Frontend

### 1. Set the frontend API URL

Before building, make sure your frontend environment points to the deployed backend:

```env
VITE_API_BASE_URL=https://api.druthdigital.com/api
```

Or for Create React App:

```env
REACT_APP_API_BASE_URL=https://api.druthdigital.com/api
```

### 2. Build the frontend locally

```bash
npm run build
```

This creates a production build folder such as `dist/` or `build/`.

### 3. Upload build files to cPanel

According to Truehost’s React-on-cPanel guide, you upload the built frontend files through cPanel File Manager after generating a production build. Source: Truehost support article on React deployment:
https://truehost.com/support/knowledge-base/deploy-react-app-on-cpanel/

Practical steps:

1. Log in to cPanel
2. Open `File Manager`
3. Go to `public_html` or your target frontend folder
4. Upload the contents of your frontend build folder, not the source code
5. Extract if uploaded as a zip
6. If your build has a nested `dist` or `build` folder, move its contents directly into the web root

### 4. SPA routing fix

If your React app uses client-side routing, add an `.htaccess` file inside the frontend root:

```apache
RewriteEngine On
RewriteBase /
RewriteRule ^index\.html$ - [L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]
```

## Part 2: Deploy the Node.js Backend

Truehost documents using `Setup Node.js App` in cPanel for Node apps, and cPanel’s official docs also support Node.js app creation through the interface. Sources:

- Truehost Node.js guide:
  https://truehost.com/support/?p=8451
- cPanel official Node.js application docs:
  https://docs.cpanel.net/knowledge-base/web-services/how-to-install-a-node.js-application/

### 1. Create a backend folder

Upload your backend project to a folder outside `public_html` if possible, for example:

```text
/home/yourcpaneluser/druth-backend
```

### 2. Open `Setup Node.js App`

In cPanel:

1. Go to `Setup Node.js App`
2. Click `Create Application`
3. Choose:
   - Node.js version: latest available stable version supported by your app
   - Application mode: `Production`
   - Application root: `druth-backend`
   - Application URL: choose your subdomain, for example `api.druthdigital.com`
   - Application startup file: `server.js`

### 3. Upload backend files

Upload these backend files into the application root:

- `server.js`
- `package.json`
- `src-backend/`
- `.env`

Do not upload `node_modules` from your local machine unless absolutely necessary.

### 4. Install dependencies

Truehost’s guide says to activate the Node virtual environment command shown in cPanel, then install dependencies. After creating the app:

1. Copy the `source` command shown in cPanel
2. Open `Terminal` or SSH
3. Paste the command
4. Change into your app root
5. Run:

```bash
npm install
```

### 5. Add environment variables

You can either:

- add them in the cPanel Node.js App environment section
- or keep them in your `.env` file if your host permits it

Use values like:

```env
NODE_ENV=production
PORT=3000
CLIENT_ORIGIN=https://druthdigital.com
SMTP_SERVICE=gmail
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=druthdigital@gmail.com
SMTP_PASS=YOUR_NEW_GMAIL_APP_PASSWORD
MAIL_FROM=Druth Digital <druthdigital@gmail.com>
LEAD_NOTIFICATION_EMAIL=druthdigital@gmail.com
MONGODB_URI=your-mongodb-atlas-uri
RATE_LIMIT_MAX=40
```

### 6. Restart the Node.js app

Both the Truehost guide and cPanel interface support stopping and restarting the application from `Setup Node.js App`.

Typical steps:

1. Open `Setup Node.js App`
2. Select your application
3. Click `Restart`

If the app does not update after changes, restart it again after:

- uploading new files
- updating `.env`
- running `npm install`

## Domain and Subdomain Setup

Recommended:

- Frontend domain: `druthdigital.com`
- Backend subdomain: `api.druthdigital.com`

In cPanel:

1. Create the subdomain `api`
2. Point it to the Node.js app URL when creating the application
3. Make sure SSL is enabled for both frontend and backend

## MongoDB Setup

Most cPanel shared hosting environments do not run MongoDB locally. Use MongoDB Atlas.

### Steps

1. Create a MongoDB Atlas cluster
2. Create a database user
3. Add your server IP to Atlas network access
4. Copy the connection string
5. Put it into:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/druth-digital?retryWrites=true&w=majority
```

## How to Test After Deployment

### Browser test

1. Open the live frontend
2. Select a plan
3. Submit the form
4. Confirm:
   - success message appears
   - admin email arrives
   - customer email arrives
   - MongoDB stores the request

### Postman test

Use the included collection:

`postman/Druth-Digital-API.postman_collection.json`

Update the variable:

```text
api_base_url = https://api.druthdigital.com/api
```

## Troubleshooting

### CORS errors

Symptom:
- browser console says blocked by CORS policy

Fix:
- set `CLIENT_ORIGIN` exactly to your frontend domain
- if multiple origins are needed, separate with commas
- restart the backend after editing env

Example:

```env
CLIENT_ORIGIN=https://druthdigital.com,https://www.druthdigital.com
```

### 404 errors

Symptom:
- frontend says endpoint not found

Fix:
- confirm the frontend is calling the correct URL
- confirm the backend subdomain is correct
- confirm the route includes `/api`

Correct example:

```text
https://api.druthdigital.com/api/subscription-requests
```

### Email not sending

Symptom:
- form submits but no mail arrives

Fix:
- generate a fresh Gmail App Password
- confirm `SMTP_USER` and `SMTP_PASS`
- check spam folder
- confirm `MAIL_FROM` matches the sending mailbox
- inspect Node app logs

Google’s official Gmail help says App Passwords are used for apps that sign in with your Google Account, and they can be revoked when you change your password. Source:
https://support.google.com/mail/answer/185833?hl=en-IN

### MongoDB connection issues

Symptom:
- backend logs connection timeout or authentication error

Fix:
- confirm Atlas username and password
- whitelist your server IP in Atlas
- verify database name in the URI
- restart the backend

### Backend not starting

Symptom:
- Node app stays stopped in cPanel

Fix:
- check `stderr.log`
- confirm `server.js` exists in the app root
- confirm `npm install` ran successfully
- confirm your Node.js version supports all dependencies

### Frontend not connecting to backend

Symptom:
- form loads but API calls fail

Fix:
- confirm frontend build used the production API URL
- rebuild the frontend after changing env
- upload the new build files again
- confirm HTTPS matches on both sides

## Best Practice Recommendation

For the cleanest production setup:

1. Host the frontend as static files on the main domain
2. Host the backend as a Node.js app on a subdomain
3. Use MongoDB Atlas
4. Use a fresh Gmail App Password or a business SMTP provider
5. Keep `.env` private and never commit it
