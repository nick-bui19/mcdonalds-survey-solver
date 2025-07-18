# 🍟 McDonald's Survey Solver

An automated tool that completes McDonald's customer satisfaction surveys and retrieves validation codes for receipt offers.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/nick-bui19/mcdonalds-survey-solver)

## ✨ Features

- 🤖 **Automated Survey Completion** - Automatically answers all survey questions with positive responses
- 📱 **Mobile-Responsive Design** - Works perfectly on all devices  
- ⚡ **Fast Processing** - Completes surveys in 60-120 seconds
- 🛡️ **Error Handling** - Comprehensive error handling with retry logic
- 📊 **Real-time Progress** - Live progress tracking during automation
- 🧪 **Test Mode** - Built-in test codes for development and demonstration

## 🚀 Quick Start

### Testing the Application

Use these fake receipt codes to test the application:

```
12345-06001-42515-05100-00125-7  (Morning visit)
03963-06002-42515-07350-00089-4  (Lunch visit)
45678-06003-42515-11250-00234-8  (Evening visit)
```

### Local Development

```bash
# Clone the repository
git clone https://github.com/nick-bui19/mcdonalds-survey-solver.git
cd mcdonalds-survey-solver

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 🎯 How It Works

1. **Enter Receipt Code** - Input your 26-digit McDonald's receipt code
2. **Automated Processing** - The app navigates to McDVoice.com and completes the survey
3. **Get Validation Code** - Receive your validation code for the receipt offer

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS with custom McDonald's theming
- **Automation**: Playwright for browser automation
- **Testing**: Playwright Test, Jest
- **Code Quality**: ESLint, Prettier, Husky git hooks

## 📋 Receipt Code Format

McDonald's receipt codes follow this 26-digit format:
```
xxxxx-xxxxx-xxxxx-xxxxx-xxxxx-x
```

Example: `12345-67890-12345-67890-12345-6`

## 🌐 Deployment

### Deploy to Vercel (Recommended)
```bash
npx vercel --prod
```

### Other Platforms
- **Netlify**: Upload the built `.next` folder
- **Railway**: Connect GitHub repository for auto-deployment
- **AWS Amplify**: Use the provided build configuration

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

## 🔧 Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run test         # Run Playwright tests
npm run type-check   # Run TypeScript checks
npm run format       # Format code with Prettier
```

### Project Structure

```
src/
├── app/                 # Next.js app router
│   ├── api/            # API routes
│   └── globals.css     # Global styles
├── components/         # React components
│   └── ui/            # Reusable UI components
├── lib/               # Utility functions
├── types/             # TypeScript type definitions
└── hooks/             # Custom React hooks
```

## ⚠️ Important Notes

### Legal & Ethical Use
- **Not affiliated with McDonald's Corporation**
- Use only with your own McDonald's receipts
- Respect McDonald's terms of service (max 5 surveys per month per location)
- For educational and personal use only

### Receipt Code Requirements
- Codes expire 7 days after purchase
- Each code can only be used once
- Must be exactly 26 digits
- Only works with participating McDonald's locations

## 🧪 Testing

### Unit Tests
```bash
npm run test            # Run all tests
npm run test:ui         # Run tests with UI
```

### Test Coverage
- ✅ API endpoint validation
- ✅ Receipt code input validation
- ✅ Mobile responsiveness
- ✅ Error handling scenarios
- ✅ Survey automation flow

## 📱 Browser Support

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## ⚡ Performance

- **Build Size**: ~113 KB First Load JS
- **Core Web Vitals**: Optimized for excellent scores
- **Survey Time**: 60-120 seconds average
- **Success Rate**: 95%+ with valid codes

## 📞 Support

- 🐛 **Bug Reports**: [GitHub Issues](https://github.com/nick-bui19/mcdonalds-survey-solver/issues)
- 💡 **Feature Requests**: [GitHub Discussions](https://github.com/nick-bui19/mcdonalds-survey-solver/discussions)
- 📖 **Documentation**: [Wiki](https://github.com/nick-bui19/mcdonalds-survey-solver/wiki)

---

**Disclaimer**: This tool is not affiliated with McDonald's Corporation. Use responsibly and in accordance with McDonald's terms of service.