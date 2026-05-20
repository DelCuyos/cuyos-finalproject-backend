# Full-Stack Authentication System — Backend API

Node.js + TypeScript + Express + Sequelize + MySQL backend for the IPT 2026 Final Project.

## Live Deployment

| Service | URL |
|---|---|
| **Frontend App** | https://cuyos-finalproject-frontend.onrender.com |
| **Backend API** | https://cuyos-finalproject-backend.onrender.com |
| **API Docs (Swagger)** | https://cuyos-finalproject-backend.onrender.com/api-docs |

---

## Features

- JWT authentication with refresh token rotation
- Role-Based Access Control (Admin / User)
- Email verification on registration
- Forgot password / reset password flow
- Swagger UI documentation at `/api-docs`
- CORS locked to the deployed frontend in production

---

## Tech Stack

- **Runtime:** Node.js + TypeScript
- **Framework:** Express
- **ORM:** Sequelize
- **Database:** MySQL
- **Email:** Nodemailer (SMTP) / Resend HTTP API
- **Auth:** express-jwt, jsonwebtoken, bcryptjs

---

## Local Setup

### Prerequisites

- Node.js 18+
- MySQL running locally
- A local MySQL database named `node_mysql_api`

### 1. Clone the repository

```bash
git clone https://github.com/DelCuyos/cuyos-finalproject-backend.git
cd cuyos-finalproject-backend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure local settings

Create a `config.json` file in the root directory (this file is git-ignored and never committed):

```json
{
    "database": {
        "host": "localhost",
        "port": 3306,
        "user": "root",
        "password": "your_mysql_password",
        "database": "node_mysql_api"
    },
    "secret": "any-local-dev-secret",
    "emailFrom": "noreply@example.com",
    "smtpOptions": {
        "host": "smtp.ethereal.email",
        "port": 587,
        "auth": {
            "user": "your_ethereal_user",
            "pass": "your_ethereal_pass"
        }
    }
}
```

> You can generate free Ethereal email credentials at https://ethereal.email

### 4. Create the MySQL database

```sql
CREATE DATABASE node_mysql_api;
```

### 5. Run in development mode

```bash
npm run start:dev
```

The API will be available at `http://localhost:4000` and Swagger at `http://localhost:4000/api-docs`.

---

## Production Deployment (Render)

### Render Service Configuration

| Setting | Value |
|---|---|
| Service Type | Web Service |
| Runtime | Node |
| Branch | main |
| Build Command | `npm ci && npm run build` |
| Start Command | `node dist/server.js` |

### Required Environment Variables

Set these in Render → your backend service → **Environment**:

| Key | Value |
|---|---|
| `NODE_ENV` | `production` |
| `PORT` | `10000` |
| `JWT_SECRET` | a long random secret string |
| `DB_HOST` | your MySQL host |
| `DB_PORT` | `3306` |
| `DB_USER` | your MySQL username |
| `DB_PASSWORD` | your MySQL password |
| `DB_NAME` | `node_mysql_api` |
| `CORS_ORIGIN` | `https://cuyos-finalproject-frontend.onrender.com` |
| `COOKIE_SECURE` | `true` |
| `COOKIE_SAMESITE` | `lax` |
| `EMAIL_FROM` | your sender email address |
| `SMTP_HOST` | your SMTP host (e.g. `smtp.ethereal.email`) |
| `SMTP_PORT` | `587` |
| `SMTP_USER` | your SMTP username |
| `SMTP_PASS` | your SMTP password |

> For production email on Render, set `RESEND_API_KEY` instead of SMTP vars (Render blocks outbound SMTP).

---

## API Endpoints

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/accounts/register` | Register new account | Public |
| POST | `/accounts/verify-email` | Verify email with token | Public |
| POST | `/accounts/authenticate` | Login | Public |
| POST | `/accounts/refresh-token` | Get new JWT via cookie | Public |
| POST | `/accounts/revoke-token` | Logout / revoke token | User |
| POST | `/accounts/forgot-password` | Request password reset | Public |
| POST | `/accounts/validate-reset-token` | Validate reset token | Public |
| POST | `/accounts/reset-password` | Reset password | Public |
| GET | `/accounts` | List all accounts | Admin |
| GET | `/accounts/:id` | Get account by ID | Admin / Own |
| PUT | `/accounts/:id` | Update account | Admin / Own |
| DELETE | `/accounts/:id` | Delete account | Admin / Own |

Full interactive documentation available at [`/api-docs`](https://cuyos-finalproject-backend.onrender.com/api-docs).

--- 

## Security Notes

- `config.json` and `.env` are git-ignored — never commit secrets
- JWT secrets and database credentials are managed via environment variables
- CORS is restricted to the deployed frontend URL in production
- Refresh tokens are stored as HTTP-only cookies