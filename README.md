# 🍟 INACTIVE: McDonald's Survey Solver

An attempt at automating McDonald's customer satisfaction surveys and retrieving validation codes for receipt offers. For educational purposes only.

## Features

- **Automated Survey Completion** - Automatically answers all survey questions with positive responses
- **Mobile-Responsive Design** - Works perfectly on all devices  
- **Fast Processing** - Completes surveys in 60-120 seconds
- **Error Handling** - Comprehensive error handling with retry logic
- **Real-time Progress** - Live progress tracking during automation
- **Test Mode** - Built-in test codes for development and demonstration

### Testing the Application

Use these fake receipt codes to test the application:

```
12345-06001-42515-05100-00125-7  (Morning visit)
03963-06002-42515-07350-00089-4  (Lunch visit)
45678-06003-42515-11250-00234-8  (Evening visit)
```

## How It Works

1. **Enter Receipt Code** - Input your 26-digit McDonald's receipt code
2. **Automated Processing** - The app navigates to McDVoice.com and completes the survey
3. **Get Validation Code** - Receive your validation code for the receipt offer

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS with custom McDonald's theming
- **Automation**: Playwright for browser automation
- **Testing**: Playwright Test, Jest
- **Code Quality**: ESLint, Prettier, Husky git hooks

## Receipt Code Format

McDonald's receipt codes follow this 26-digit format:
```
xxxxx-xxxxx-xxxxx-xxxxx-xxxxx-x
```

Example: `12345-67890-12345-67890-12345-6`


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

### Receipt Code Requirements
- Codes expire 7 days after purchase
- Each code can only be used once
- Must be exactly 26 digits
- Only works with participating McDonald's locations

## Testing

### Unit Tests
```bash
npm run test            # Run all tests
npm run test:ui         # Run tests with UI
```

### Test Coverage
- API endpoint validation
- Receipt code input validation
- Mobile responsiveness
- Error handling scenarios
- Survey automation flow


## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Disclaimer**: This tool is not affiliated with McDonald's Corporation. 
