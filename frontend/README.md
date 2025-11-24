# Stock Portfolio Tracker - Frontend

A modern React + Vite application for tracking stock portfolio with real-time price updates and comprehensive portfolio analytics.

## Tech Stack

- **React 18** - UI library with hooks
- **Vite** - Build tool & dev server (lightning-fast HMR)
- **React Router v6** - Client-side routing with protected routes
- **Zustand** - State management for auth & app state
- **Axios** - HTTP client with JWT interceptors & error handling
- **React Hook Form** - Form handling & validation with real-time feedback
- **Tailwind CSS** - Utility-first CSS framework with dark mode support
- **Recharts** - Interactive charts & data visualization
- **Heroicons** - Premium SVG icons
- **React Hot Toast** - Toast notifications for user feedback
- **Date-fns** - Date formatting & manipulation utilities
- **SWC** - Fast JavaScript compiler for Vite

## Project Structure

```
src/
├── components/
│   ├── Auth/               # Authentication components
│   │   ├── LoginForm.jsx  # Email/Password login
│   │   ├── RegisterForm.jsx # User registration
│   │   └── GoogleOAuth.jsx # Google OAuth integration
│   ├── Dashboard/         # Dashboard & analytics
│   │   ├── DashboardSummary.jsx
│   │   ├── PortfolioDistributionChart.jsx
│   │   ├── PerformanceChart.jsx
│   │   └── TopHoldingsCard.jsx
│   ├── Holdings/          # Portfolio holdings
│   │   ├── HoldingsList.jsx
│   │   ├── HoldingsTable.jsx
│   │   ├── AddHoldingForm.jsx
│   │   ├── EditHoldingForm.jsx
│   │   └── HoldingCard.jsx
│   ├── Transactions/      # Transaction history
│   │   ├── TransactionsList.jsx
│   │   ├── TransactionsTable.jsx
│   │   ├── AddTransactionForm.jsx
│   │   └── TransactionFilters.jsx
│   ├── Layout/            # Layout components
│   │   ├── Navbar.jsx     # Navigation header
│   │   ├── Sidebar.jsx    # Side navigation
│   │   ├── MainLayout.jsx # Protected page wrapper
│   │   └── Footer.jsx     # Footer
│   └── Common/            # Shared components
│       ├── LoadingSpinner.jsx
│       ├── EmptyState.jsx
│       ├── ConfirmDialog.jsx
│       ├── Modal.jsx
│       └── ErrorBoundary.jsx
├── pages/
│   ├── LandingPage.jsx    # Public landing page
│   ├── LoginPage.jsx      # Sign in page
│   ├── RegisterPage.jsx   # Sign up page
│   ├── DashboardPage.jsx  # Portfolio overview
│   ├── HoldingsPage.jsx   # Holdings management
│   ├── TransactionsPage.jsx # Transaction history
│   ├── HowItWorksPage.jsx # Feature guide
│   ├── TermsPage.jsx      # Terms & conditions
│   └── NotFoundPage.jsx   # 404 page
├── services/
│   ├── api.js             # Axios instance with interceptors
│   ├── authService.js     # Authentication API calls
│   ├── holdingsService.js # Holdings CRUD operations
│   ├── transactionsService.js # Transaction API calls
│   └── dashboardService.js # Dashboard data fetching
├── stores/
│   ├── authStore.js       # Zustand auth state
│   ├── holdingsStore.js   # Holdings state
│   ├── transactionsStore.js # Transactions state
│   └── appStore.js        # General app state (theme, loading)
├── hooks/
│   ├── useAuth.js         # Authentication hook
│   ├── useHoldings.js     # Holdings management hook
│   ├── useTransactions.js # Transactions hook
│   ├── useDashboard.js    # Dashboard data hook
│   └── useLocalStorage.js # Local storage utilities
├── routes/
│   ├── ProtectedRoute.jsx # Route protection wrapper
│   ├── index.js           # Route configuration
│   └── navigation.js      # Navigation structure
├── utils/
│   ├── formatters.js      # Currency, date, percentage formatting
│   ├── validators.js      # Form validation rules
│   ├── calculations.js    # Financial calculations (P&L, etc)
│   ├── constants.js       # App constants & config
│   └── helpers.js         # General utilities
├── styles/
│   ├── index.css          # Global styles
│   ├── tailwind.css       # Tailwind directives
│   └── custom.css         # Custom component styles
├── contexts/
│   └── ThemeContext.jsx   # Dark/Light theme context
├── assets/
│   ├── images/            # Images & icons
│   ├── logos/             # Logo variants
│   └── illustrations/     # SVG illustrations
├── config/
│   ├── routes.js          # Route paths configuration
│   └── colors.js          # Color scheme constants
├── App.jsx                # Root component with routing
└── main.jsx               # Application entry point
```

## Installation & Setup

### Prerequisites
- Node.js 16+ and npm 8+
- Backend API running (see backend README)
- Modern web browser

### 1. Install Dependencies
```bash
cd frontend
npm install
```

### 2. Environment Configuration
Create `.env` file in the frontend directory:

```env
VITE_API_URL=https://api.portfoliotrack.sahilfolio.live/api

# Firebase Configuration
VITE_FIREBASE_API_KEY=tour_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
VITE_FIREBASE_APP_ID=your_firebsae_app_id
```

> **NOTE**: We can change the `VITE_API_URL` if we are also hosting the backend directory on the local machine where we can keep `VITE_API_URL`:`http://localhost:5000/api`

### 3. Start Development Server
```bash
npm run dev
```
- Opens automatically at `http://localhost:5173`
- Hot reload enabled for instant feedback

## Features Implemented

### Authentication System
- **Email/Password Registration** - Secure signup with validation
- **Email/Password Login** - Standard authentication with remember me
- **Google OAuth** - One-click Google Sign-In integration
- **JWT Token Management** - Automatic token refresh & injection
- **Protected Routes** - Automatic redirects for unauthenticated users
- **Session Persistence** - Tokens stored securely in localStorage
- **Password Reset** - Email-based password recovery with OTP
- **Two-Factor Authentication** - Optional OTP verification

### Dashboard & Analytics
- **Portfolio Summary Cards** - Total invested, current value, P&L, gain %
- **Portfolio Distribution Chart** - Interactive pie chart by allocation %
- **Performance Chart** - Line chart showing portfolio growth over time
- **Best/Worst Performers** - Top 3 gainers and losers
- **Real-time Updates** - Data refreshes every 60 seconds
- **Custom Date Ranges** - Filter performance by time periods
- **Quick Stats** - Daily change, holdings count, asset breakdown

### Holdings Management
- **Holdings List View** - Sortable table with key metrics
- **Add Holdings** - Modal form with real-time validation
- **Edit Holdings** - Update quantity and purchase price
- **Delete Holdings** - With confirmation dialog
- **Real-time P&L** - Automatic calculation with current prices
- **Holdings Search** - Filter by symbol or company name
- **Export Holdings** - Download portfolio as CSV
- **Bulk Operations** - Multi-select delete functionality

### Transaction History
- **Transaction List** - Chronological view with filtering
- **Add Transactions** - Record buy/sell transactions
- **Filter & Sort** - By symbol, type, date, and amount
- **Delete Transactions** - Remove individual transactions
- **Transaction Summary** - Total invested, gains, average cost
- **Export History** - Download transactions as CSV
- **Transaction Categories** - BUY, SELL, DIVIDEND types

### User Experience Features
- **Navbar** - Navigation with user profile dropdown
- **Mobile Responsive** - Works perfectly on all devices
- **Dark Mode** - Toggle between light and dark themes
- **Toast Notifications** - User feedback for actions
- **Loading States** - Smooth loading indicators
- **Error Handling** - User-friendly error messages
- **Form Validation** - Real-time field validation
- **Empty States** - Helpful guidance when no data

### Additional Pages
- **Landing Page** - Public-facing home page with features
- **How It Works** - Tutorial page with screenshots
- **Terms & Conditions** - Legal documentation
- **User Profile** - Profile view and settings
- **404 Page** - Friendly not found page

### Technical Features
- **API Integration** - RESTful API with Axios
- **State Management** - Zustand for global state
- **Error Boundaries** - React error handling
- **Performance Optimization** - Code splitting & lazy loading
- **SEO Ready** - Meta tags and structured data
- **Accessibility** - WCAG 2.1 compliance
- **Security** - XSS protection, CSRF tokens

## API Endpoints Reference

All endpoints require JWT authentication (except `/auth` endpoints). Base URL: `https://api.portfoliotrack.sahilfolio.live/api`

### Authentication Endpoints
```
POST   /auth/register           # Register new user
POST   /auth/login              # Login with email/password
POST   /auth/google             # Google OAuth login
GET    /auth/me                 # Get current user profile
PUT    /auth/update-profile     # Update user profile
PUT    /auth/change-password    # Change password
POST   /auth/forgot-password    # Request password reset
POST   /auth/reset-password     # Reset password with token
```

### Holdings Endpoints
```
GET    /holdings                # Get all user holdings
POST   /holdings                # Add new holding
GET    /holdings/:id            # Get specific holding
PUT    /holdings/:id            # Update holding
DELETE /holdings/:id            # Delete holding
GET    /holdings/:id/chart      # Get holding performance chart
```

### Transactions Endpoints
```
GET    /transactions            # Get all transactions (with filters)
POST   /transactions            # Add new transaction
GET    /transactions/:id        # Get specific transaction
DELETE /transactions/:id        # Delete transaction
GET    /transactions/summary    # Get transaction summary stats
```

### Dashboard Endpoints
```
GET    /dashboard/summary       # Portfolio summary metrics
GET    /dashboard/distribution  # Holdings distribution data
GET    /dashboard/performance   # Portfolio performance over time
GET    /dashboard/stats/:days   # Statistics for custom date range
```

## Component Examples & Usage

### Using Authentication Hook
```jsx
import { useAuth } from '../hooks/useAuth';

function UserProfile() {
  const { user, logout, token, isAuthenticated } = useAuth();
  
  if (!isAuthenticated) return null;
  
  return (
    <div>
      <p>Welcome, {user?.name}!</p>
      <p>Email: {user?.email}</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

### Using Holdings Hook
```jsx
import { useHoldings } from '../hooks/useHoldings';

function HoldingsList() {
  const { holdings, loading, error, deleteHolding } = useHoldings();
  
  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage msg={error} />;
  
  return (
    <div>
      {holdings.map(holding => (
        <HoldingCard 
          key={holding._id} 
          holding={holding}
          onDelete={() => deleteHolding(holding._id)}
        />
      ))}
    </div>
  );
}
```

### Using Dashboard Hook
```jsx
import { useDashboard } from '../hooks/useDashboard';

function PortfolioSummary() {
  const { summary, performance, distribution } = useDashboard();
  
  return (
    <div>
      <h2>Portfolio Value: ₹{summary?.currentValue}</h2>
      <p>P&L: {summary?.profitLossPercentage}%</p>
      <PerformanceChart data={performance} />
      <DistributionChart data={distribution} />
    </div>
  );
}
```

### Using API Service
```jsx
import holdingsService from '../services/holdingsService';

async function addNewHolding() {
  try {
    const response = await holdingsService.create({
      symbol: 'AAPL',
      purchasePrice: 150,
      quantity: 10,
      purchaseDate: new Date()
    });
    toast.success('Holding added successfully!');
  } catch (error) {
    toast.error(error.message);
  }
}
```

### Using Zustand Store Directly
```jsx
import { useAuthStore } from '../stores/authStore';

function Navbar() {
  const { user, token, logout, setUser } = useAuthStore();
  
  return (
    <nav>
      {user && <span>{user.name}</span>}
      <button onClick={logout}>Logout</button>
    </nav>
  );
}
```

### Form Validation Example
```jsx
import { useForm } from 'react-hook-form';
import { validateEmail, validatePassword } from '../utils/validators';

function LoginForm() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input 
        {...register('email', { 
          required: 'Email is required',
          validate: validateEmail 
        })} 
      />
      {errors.email && <span>{errors.email.message}</span>}
      
      <input 
        {...register('password', { 
          required: 'Password is required',
          validate: validatePassword 
        })} 
        type="password"
      />
      {errors.password && <span>{errors.password.message}</span>}
      
      <button type="submit">Login</button>
    </form>
  );
}
```

## Styling & Theming

### Tailwind CSS Custom Classes

**Buttons:**
```css
.btn-primary      /* Sky blue primary action button */
.btn-secondary    /* Gray secondary button */
.btn-danger       /* Red destructive action button */
.btn-success      /* Green success button */
.btn-warning      /* Orange warning button */
.btn-sm           /* Small button variant */
.btn-lg           /* Large button variant */
.btn-block        /* Full width button */
```

**Forms:**
```css
.input            /* Standard input field styling */
.input-error      /* Input with error state (red border) */
.label            /* Form label styling */
.error-text       /* Error message text (red) */
.success-text     /* Success message text (green) */
.input-group      /* Group related inputs */
```

**Cards & Containers:**
```css
.card             /* Card container with shadow */
.card-hover       /* Card with hover elevation effect */
.card-primary     /* Card with primary background */
.shadow-sm        /* Small shadow */
.shadow-md        /* Medium shadow */
.shadow-lg        /* Large shadow */
```

**Layout:**
```css
.container        /* Max-width container */
.flex             /* Flexbox container */
.grid             /* CSS Grid container */
.gap-*            /* Spacing utilities */
.p-*              /* Padding utilities */
.m-*              /* Margin utilities */
```

### Dark Mode Support
- **Theme Toggle** - Located in navbar/settings
- **Persistent Theme** - Saved to localStorage
- **System Preference** - Detects OS dark mode
- **Smooth Transitions** - Animated theme changes

```jsx
// Using theme in components
import { useTheme } from '../contexts/ThemeContext';

function MyComponent() {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <div className={theme === 'dark' ? 'bg-gray-900' : 'bg-white'}>
      <button onClick={toggleTheme}>
        Toggle {theme === 'dark' ? 'Light' : 'Dark'} Mode
      </button>
    </div>
  );
}
```

## Environment Variables

```env
VITE_API_URL=https://api.portfoliotrack.sahilfolio.live/api

# Firebase Configuration
VITE_FIREBASE_API_KEY=tour_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
VITE_FIREBASE_APP_ID=your_firebsae_app_id
```

### User Flow Steps:

1. **Register** 
   - Go to `/register`
   - Create account with email and password
   - Or use Google OAuth for quick signup

2. **Login**
   - Go to `/login`
   - Use credentials or Google OAuth
   - Check "Remember me" for persistent login

3. **Dashboard**
   - View portfolio overview
   - See P&L calculations
   - Check distribution chart
   - View performance trends

4. **Add Holdings**
   - Click "Add Holding" button
   - Enter stock symbol (e.g., AAPL, GOOGL)
   - Set purchase price and quantity
   - Select purchase date
   - Submit to add holding

5. **Manage Holdings**
   - Edit holdings to update quantity
   - Delete holdings with confirmation
   - View individual P&L for each stock

6. **View Transactions**
   - See complete transaction history
   - Filter by symbol or type
   - Download transaction history

7. **User Settings**
   - Toggle dark mode
   - Update profile information
   - Change password
   - Logout

## Performance Tips

1. **Optimize Images**
   - Vite automatically optimizes imported images
   - Use appropriate image formats (WebP for modern browsers)

2. **Code Splitting**
   - React Router enables automatic route-based code splitting
   - Chunks loaded on demand for better performance

3. **Lazy Loading**
   - Components are lazy loaded for faster initial load
   - Charts and large components load asynchronously

4. **API Caching**
   - Holdings and transactions cached on client
   - Reduce unnecessary API calls
   - Manual refresh available when needed

5. **State Management**
   - Zustand provides minimal bundle size overhead
   - Selective updates prevent unnecessary re-renders

## Deployment

### Deploy to Vercel (Recommended)

1. **Connect GitHub Repository**
   - Push code to GitHub
   - Go to https://vercel.com
   - Click "New Project"
   - Select your repository

2. **Configure Environment**
   - Set `VITE_API_URL` in Vercel dashboard
   - Value: `https://api.portfoliotrack.sahilfolio.live/api`

3. **Deploy**
   - Vercel auto-detects Vite framework
   - Builds and deploys automatically
   - Custom domain support available

## Project Links

- **Repository**: https://github.com/Sahilll94/Stock-Market-Portfolio-Tracker
- **Backend API**: https://api.portfoliotrack.sahilfolio.live/api
- **Live Demo**: https://portfoliotrack.sahilfolio.live

---

**Last Updated**: November 2024  
**Version**: 1.0.0  