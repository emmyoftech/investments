# Trades Global FX - Investment Platform

A full-stack cryptocurrency investment platform built with modern web technologies, enabling users to manage funds, make investments, track profits, and handle withdrawals securely.

## 🚀 Features

### Core Functionality
- **User Authentication**: Secure signup/signin with password hashing
- **Fund Management**: Add funds via cryptocurrency deposits with admin approval workflow
- **Investment Plans**: Multiple investment options with configurable ROI and durations
- **Withdrawal System**: Secure withdrawal requests with admin approval
- **Dashboard**: Real-time balance tracking, transaction history, and earnings visualization
- **Referral System**: Reward points for user referrals
- **Profit Accrual**: Automated ROI calculations and balance updates

### Security & Validation
- Rate limiting on all endpoints
- Input validation with Zod schemas
- Atomic database transactions
- Password hashing with bcrypt
- Admin approval workflow for deposits/withdrawals
- Audit trails via transaction logging

### User Experience
- Responsive design with Tailwind CSS
- Real-time data updates with SWR
- Loading states and error handling
- Mobile-optimized interface
- Interactive charts and progress tracking

## 🛠️ Technology Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first styling
- **Recharts** - Data visualization
- **React Icons** - Icon library
- **SWR** - Data fetching and caching

### Backend
- **Next.js API Routes** - Serverless functions
- **Prisma ORM** - Database operations
- **PostgreSQL** - Primary database
- **bcrypt** - Password hashing
- **EmailJS** - Admin notifications
- **UUID** - Transaction references

### Infrastructure
- **Rate Limiting** - express-rate-limit
- **Environment Variables** - Configuration management
- **Prisma Migrations** - Database versioning

## 📊 Database Schema

The application uses 8 main models:

- **User**: Profile, balances, earnings, ROI metrics
- **Deposit**: Fund additions with approval workflow
- **Investment**: Investment plans with ROI and maturity dates
- **Transaction**: Audit log for all financial operations
- **Withdrawal**: Withdrawal requests with approval status
- **Referral**: User referral system
- **RewardLedger**: Points earned and redeemed
- **Referral**: Referral code management

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL database
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd investment
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env.local` file with the following variables:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/investment_db"
   NEXTAUTH_SECRET="your-secret-key"
   NEXTAUTH_URL="http://localhost:3000"
   EMAILJS_SERVICE_ID="your-emailjs-service-id"
   EMAILJS_TEMPLATE_ID="your-emailjs-template-id"
   EMAILJS_PUBLIC_KEY="your-emailjs-public-key"
   ADMIN_EMAIL="admin@yourdomain.com"
   BASE_URL="http://localhost:3000"
   ```

4. **Database Setup**
   ```bash
   # Generate Prisma client
   npx prisma generate

   # Run database migrations
   npx prisma migrate dev

   # (Optional) Seed the database
   npx prisma db seed
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) to view the application.

## 📝 Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm test` - Run Jest tests
- `npm run test:watch` - Run tests in watch mode

## 🔄 Core Workflows

### 1. User Registration & Authentication
- User signs up → Password hashed → Account created
- JWT-like session management via localStorage
- Protected routes with AuthContext

### 2. Deposit (Add Funds) Flow
```
User submits deposit → Pending transaction created → Admin notified via email
    ↓
Admin approves → Balance credited → Transaction completed
```

### 3. Investment Flow
```
User selects plan → Validates balance → Atomic transaction:
- Deduct mainBalance
- Credit investmentBalance
- Create investment record
- Log transaction
```

### 4. Withdrawal Flow
```
User requests withdrawal → Balance deducted → Pending status
    ↓
Admin approves/rejects → Balance adjusted accordingly
```

## 🛡️ Security Measures

- **Authentication**: bcrypt password hashing, secure session management
- **Rate Limiting**: 5 req/15min (auth), 20 req/15min (transactions), 100 req/15min (general)
- **Validation**: Comprehensive input validation with Zod schemas
- **Data Protection**: Sanitized responses, UUID transaction refs
- **Transaction Security**: Atomic operations, balance validation, audit trails

## 🧪 Testing

Run the test suite:
```bash
npm test
```

Run tests in watch mode:
```bash
npm run test:watch
```

## 📁 Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── dashboard/         # Dashboard page
│   ├── addFunds/          # Deposit page
│   ├── investmentPlans/   # Investment page
│   └── screens/           # Static pages (Home, About, etc.)
├── components/            # Reusable UI components
├── lib/                   # Utilities and services
│   ├── services/         # Business logic services
│   ├── hooks/            # Custom React hooks
│   └── utils/            # Helper functions
└── types/                 # TypeScript type definitions
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For support, email support@tradesglobalfx.com or join our Discord community.

---

**Trades Global FX** - Empowering traders globally with secure, accessible cryptocurrency investments.
