# McDonald's Survey Solver - Deployment Guide

## 🚀 Quick Deploy to Vercel (Recommended)

### Option 1: One-Click Deploy
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/nick-bui19/mcdonalds-survey-solver)

### Option 2: Manual Deployment

1. **Fork/Clone the repository**
   ```bash
   git clone https://github.com/nick-bui19/mcdonalds-survey-solver.git
   cd mcdonalds-survey-solver
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Deploy to Vercel**
   ```bash
   npx vercel --prod
   ```

4. **Alternative: Connect GitHub to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Vercel will auto-deploy on every push

## ⚙️ Environment Configuration

### Required Environment Variables
No environment variables are required for basic functionality.

### Optional Environment Variables
- `NODE_ENV=production` (automatically set by Vercel)

## 🧪 Testing Your Deployment

### Test Codes (Development Mode Only)
Use these fake receipt codes to test the application:

- `12345-06001-42515-05100-00125-7` (Morning visit)
- `03963-06002-42515-07350-00089-4` (Lunch visit)  
- `45678-06003-42515-11250-00234-8` (Evening visit)

**Note:** Test codes only work in development mode. In production, you'll need real McDonald's receipt codes.

### Testing Real Codes
1. Get a McDonald's receipt with a 26-digit survey code
2. Enter the code in the format: `xxxxx-xxxxx-xxxxx-xxxxx-xxxxx-x`
3. The app will automatically complete the survey and return a validation code

## 🏗️ Alternative Deployment Options

### Deploy to Netlify
```bash
npm run build
# Upload the .next folder to Netlify
```

### Deploy to Railway
1. Connect your GitHub repository to Railway
2. Railway will automatically detect Next.js and deploy

### Deploy to AWS Amplify  
1. Connect your GitHub repository to AWS Amplify
2. Use build settings:
   ```yaml
   version: 1
   frontend:
     phases:
       preBuild:
         commands:
           - npm ci
           - npx playwright install
       build:
         commands:
           - npm run build
     artifacts:
       baseDirectory: .next
       files:
         - '**/*'
   ```

## 📱 Features Available After Deployment

- ✅ Receipt code validation
- ✅ Automated survey completion
- ✅ Validation code extraction
- ✅ Mobile-responsive design
- ✅ Error handling and retry logic
- ✅ Real-time progress tracking

## ⚠️ Important Notes

### Legal & Ethical Use
- **Not affiliated with McDonald's Corporation**
- Use only with your own receipts
- Respect McDonald's 5-survey monthly limit per location
- For educational and personal use only

### Browser Compatibility
- Works on all modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile-friendly responsive design
- JavaScript required

### Performance
- Survey completion: 60-120 seconds average
- Supports concurrent users
- Serverless function timeout: 5 minutes maximum

## 🔧 Troubleshooting

### Common Issues

1. **"Survey automation failed"**
   - McDonald's website might be down
   - Receipt code might be expired (7-day limit)
   - Code might have been used already

2. **"Invalid receipt code format"**
   - Ensure code is exactly 26 digits
   - Check for typing errors
   - Try copying/pasting the code

3. **Deployment fails**
   - Check Node.js version (18+ required)
   - Verify all dependencies are installed
   - Check build logs for specific errors

### Support
- Check the Issues tab on GitHub
- Review the deployment logs in your hosting platform
- Test with the provided test codes first

## 📊 Monitoring

### Recommended Monitoring
- Vercel Analytics (built-in)
- Sentry for error tracking
- Vercel Edge Network metrics

### Success Metrics to Track
- Survey completion rate
- Average processing time
- Error rates by type
- User satisfaction