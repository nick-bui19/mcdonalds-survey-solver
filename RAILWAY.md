# Railway Deployment Guide

## Quick Deploy to Railway

Railway supports containerized deployments, making it perfect for running Playwright browser automation.

### 1. Create Railway Project

1. Go to [railway.app](https://railway.app)
2. Sign in with GitHub
3. Click "New Project"
4. Choose "Deploy from GitHub repo"
5. Select your forked repository

### 2. Configure Environment Variables

In your Railway project dashboard:
- Set `NODE_ENV=production`
- Set `PORT=3000` (Railway will auto-detect this)

### 3. Deploy

Railway will automatically:
1. Detect the Dockerfile
2. Build the container with Playwright
3. Deploy to a public URL
4. Enable real receipt code processing

### 4. Test Real Receipt Codes

Once deployed, you can use real McDonald's receipt codes:
- Format: `xxxxx-xxxxx-xxxxx-xxxxx-xxxxx-x`
- The app will automatically complete the survey
- Returns validation codes for offers

## Features Enabled

✅ **Real Receipt Code Processing** - Works with actual McDonald's receipts
✅ **Browser Automation** - Full Playwright support in containers
✅ **Longer Timeouts** - Railway supports longer execution times
✅ **Reliable Deployment** - Container-based deployment is more stable

## Troubleshooting

### Build Issues
- Railway build timeout: Increase resources in Railway settings
- Dockerfile errors: Check logs in Railway dashboard

### Runtime Issues
- Browser crashes: Railway containers have sufficient resources
- Survey failures: Check McDonald's website status

### Performance
- Cold starts: ~10-15 seconds on Railway
- Survey completion: 60-120 seconds average
- Concurrent users: Supported with auto-scaling

## Cost

Railway offers:
- Free tier: 500 hours/month
- Paid plans: $5/month for hobby use
- Perfect for personal McDonald's survey automation

## Migration from Vercel

If migrating from Vercel:
1. Keep Vercel deployment for test codes
2. Use Railway for real receipt processing
3. Update frontend to point to Railway API for real codes