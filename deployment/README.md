# Deployment

> Deployment guides, configuration files, and scripts for EscapeHer.

## Structure

```
deployment/
├── README.md                    # This file
├── deployment-checklist.md      # Pre-deployment verification checklist
├── env/                         # Environment variable templates
├── nginx/                       # Nginx reverse proxy configs (optional)
├── render/                      # Render deployment configuration
├── scripts/                     # Deployment automation scripts
└── vercel/                      # Vercel deployment configuration
```

## Quick Deploy

### Frontend (Vercel)

```bash
# From the client directory
cd client
vercel --prod
```

### Backend (Render)

1. Push to the `main` branch.
2. Render auto-deploys from the configured branch.
3. Alternatively, trigger a manual deploy from the Render dashboard.

## Environment Setup

Copy the appropriate `.env.example` file for your environment:

```bash
# Client
cp deployment/env/.env.client.example client/.env.local

# Server
cp deployment/env/.env.server.example server/.env
```

Edit the files with your actual credentials before deploying.

## Monitoring

- **Vercel**: Built-in analytics and function logs
- **Render**: Service logs and health checks
- **MongoDB Atlas**: Performance Advisor and alerts
- **Firebase**: Crashlytics and Cloud Monitoring

## Rollback

### Vercel
```bash
# List recent deployments
vercel ls

# Rollback to a previous deployment
vercel rollback <deployment-url>
```

### Render
1. Go to the service dashboard → Deploys tab.
2. Click "Rollback" on a previous successful deploy.

## See Also

- [Deployment Guide](../docs/setup/deployment.md) — Full step-by-step instructions
- [Deployment Checklist](./deployment-checklist.md) — Pre-deployment verification
