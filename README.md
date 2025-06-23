# TradeWizard - Advanced Trading Bot Platform

A comprehensive trading bot platform that enables users to create, test, and deploy automated trading strategies across multiple markets.

## 🚀 Features

- **Bot Marketplace**: Browse and subscribe to trading bots
- **Bot Builder**: Create custom trading strategies with visual tools
- **Real-time Analytics**: Track performance with detailed metrics
- **Secure Payments**: Multiple payment gateway integrations
- **Risk Management**: Comprehensive risk assessment and controls
- **API Access**: RESTful API for programmatic access
- **Multi-platform Support**: Works with MT4, MT5, and Deriv

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **shadcn/ui** for component library
- **React Query** for data fetching and caching
- **React Router** for navigation
- **Recharts** for analytics visualization

### Backend
- **Node.js** with Express
- **Supabase** for database and authentication
- **JWT** for session management
- **Rate limiting** with Redis support
- **Input validation** with comprehensive sanitization

## 📋 Prerequisites

- Node.js 18+ and npm
- Git for version control
- Supabase account (for production database)

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone <repository-url>
cd tradewizard
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Setup
Copy the environment template and configure:
```bash
cp .env.example .env
```

Configure the following variables:
```env
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# API Configuration
VITE_API_URL=http://localhost:5000/api

# Payment Gateway Keys (Production)
STRIPE_SECRET_KEY=your_stripe_secret_key
MPESA_CONSUMER_KEY=your_mpesa_consumer_key
MPESA_CONSUMER_SECRET=your_mpesa_consumer_secret
```

### 4. Start Development
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run test` - Run test suite
- `npm run test:watch` - Run tests in watch mode
- `npm run lint` - Lint code with ESLint
- `npm run type-check` - Type check with TypeScript

### Project Structure
```
src/
├── components/          # Reusable UI components
│   ├── auth/           # Authentication components
│   ├── bots/           # Bot-related components
│   ├── ui/             # Base UI components
│   └── ...
├── pages/              # Page components
├── hooks/              # Custom React hooks
├── lib/                # Utility libraries
├── contexts/           # React contexts
├── types/              # TypeScript type definitions
└── test/               # Test utilities and setup
```

## 🧪 Testing

The project uses Vitest and React Testing Library for testing:

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## 🔒 Security Features

- **JWT Authentication** with secure session management
- **Rate Limiting** on API endpoints
- **Input Validation** and sanitization
- **CSRF Protection** for state-changing operations
- **Secure API Key Management** with rotation support
- **Role-based Access Control** (RBAC)

## 📊 Analytics & Monitoring

- Real-time performance tracking
- Error boundary implementation
- Comprehensive logging
- Performance metrics collection
- User behavior analytics

## 🚀 Deployment

### Production Build
```bash
npm run build
```

### Deploy to Replit
The application is configured for easy deployment on Replit:

1. Import the repository to Replit
2. Configure environment variables in Secrets
3. Run the application with the configured run command

## 🔌 API Documentation

### Authentication Endpoints
- `POST /api/auth/login` - User login
- `POST /api/auth/signup` - User registration
- `POST /api/auth/logout` - User logout
- `GET /api/auth/session` - Get current session

### Bot Management
- `GET /api/bots` - List all bots
- `POST /api/bots` - Create new bot
- `GET /api/bots/:id` - Get bot details
- `PUT /api/bots/:id` - Update bot
- `DELETE /api/bots/:id` - Delete bot

### Analytics
- `GET /api/analytics/dashboard` - Dashboard metrics
- `GET /api/analytics/performance` - Performance data
- `GET /api/analytics/trades` - Trading history

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- Documentation: [docs/](docs/)
- Issues: [GitHub Issues](https://github.com/your-repo/issues)
- Discussions: [GitHub Discussions](https://github.com/your-repo/discussions)

## 🗺️ Roadmap

- [ ] Advanced Bot Builder with visual programming
- [ ] Machine Learning integration for strategy optimization
- [ ] Mobile application (React Native)
- [ ] Advanced analytics and reporting
- [ ] Social trading features
- [ ] Multi-language support (i18n)
- [ ] WebSocket real-time updates