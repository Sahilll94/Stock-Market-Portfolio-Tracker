# Stock Portfolio Tracker - Frontend

A modern React + Vite application for tracking stock portfolio with real-time price updates.

## Tech Stack

- **React 18** - UI library
- **Vite** - Build tool & dev server (SWC compiler)
- **React Router v6** - Client-side routing
- **Zustand** - State management
- **Axios** - HTTP client with JWT interceptors
- **React Hook Form** - Form handling & validation
- **Tailwind CSS** - Utility-first CSS framework
- **Recharts** - Charts & data visualization
- **Heroicons** - SVG icons
- **React Hot Toast** - Toast notifications
- **Date-fns** - Date formatting utilities

## Project Structure

```
src/
├── components/          # React components
│   ├── Auth/           # Authentication forms (Login, Register)
│   ├── Dashboard/      # Dashboard charts & summary
│   ├── Holdings/       # Portfolio holdings components
│   ├── Transactions/   # Transaction history components
│   ├── Layout/         # Navigation & layout wrappers
│   └── Common/         # Shared components (spinners, empty states)
├── pages/              # Page components (routes)
├── services/           # API service layer
├── stores/             # Zustand state management
├── hooks/              # Custom React hooks
├── routes/             # Routing configuration
├── utils/              # Utilities (formatters, validators, helpers)
├── styles/             # Global CSS & Tailwind config
├── App.jsx            # Root component
└── main.jsx           # Entry point
```

## Installation & Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Environment configuration**
   Create `.env` file:
   ```
   VITE_API_URL=https://api.stocks.sahilfolio.live/api
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```
   Opens automatically at `http://localhost:3000`

4. **Build for production**
   ```bash
   npm run build
   ```

5. **Preview production build**
   ```bash
   npm run preview
   ```

## Features Implemented

### ✅ Authentication
- **Register Page** - Sign up with email/password
- **Login Page** - Sign in with remember me option
- **Protected Routes** - Automatic redirects for unauthenticated users
- **JWT Token Management** - Automatic token injection in API calls

### ✅ Dashboard
- **Portfolio Summary Cards** - Total invested, current value, P&L, holdings count
- **Portfolio Distribution Chart** - Pie chart showing allocation
- **Performance Chart** - Line chart tracking value over time
- **Refresh Data** - Manual refresh functionality

### ✅ Holdings Management
- **Holdings List** - Table/card view with sorting
- **Add Holding** - Modal form to add new holdings
- **Edit Holding** - Update quantity and price
- **Delete Holding** - Remove holdings with confirmation
- **P&L Calculation** - Real-time profit/loss display

### ✅ Transaction History
- **Transaction List** - Chronological transaction history
- **Add Transaction** - Record buy/sell transactions
- **Filter Transactions** - By symbol and type (buy/sell)
- **Delete Transaction** - Remove transaction records

### ✅ Navigation & Layout
- **Navbar** - Navigation with user profile dropdown
- **MainLayout** - Consistent layout wrapper for protected pages
- **Mobile Responsive** - Works on mobile, tablet, and desktop
- **Logout** - Secure logout functionality

## API Endpoints

All endpoints require JWT token authentication (except auth endpoints).

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user
- `GET /auth/me` - Get current user
- `PUT /auth/update-profile` - Update profile
- `PUT /auth/change-password` - Change password

### Holdings
- `GET /holdings` - Get all holdings
- `POST /holdings` - Add new holding
- `PUT /holdings/:id` - Update holding
- `DELETE /holdings/:id` - Delete holding

### Transactions
- `GET /transactions` - Get transactions (with filters)
- `POST /transactions` - Add transaction
- `DELETE /transactions/:id` - Delete transaction

### Dashboard
- `GET /dashboard/summary` - Portfolio summary
- `GET /dashboard/distribution` - Holdings distribution
- `GET /dashboard/performance/:days` - Performance over time

## Component Examples

### Using Custom Hooks
```jsx
import { useAuth } from '../hooks/useAuth';

function MyComponent() {
  const { user, logout, token } = useAuth();
  
  return (
    <div>
      <p>User: {user?.name}</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

### Using Services
```jsx
import holdingsService from '../services/holdingsService';

const response = await holdingsService.getAll();
const holding = await holdingsService.create(data);
```

### Using Zustand Store Directly
```jsx
import { useAuthStore } from '../stores/authStore';

const { user, token, logout } = useAuthStore();
```

## Styling

### Tailwind CSS Custom Classes

**Buttons:**
- `.btn-primary` - Primary action button (sky blue)
- `.btn-secondary` - Secondary action button (gray)
- `.btn-danger` - Destructive action button (red)
- `.btn-sm` - Small button variant

**Forms:**
- `.input` - Input field styling
- `.input-error` - Input with error state
- `.label` - Form label
- `.error-text` - Error message text

**Cards:**
- `.card` - Card container with shadow
- `.card-hover` - Card with hover effect

## Environment Variables

```env
VITE_API_URL=https://api.stocks.sahilfolio.live/api
```

## Testing the Application

1. **Register** - Create new account at `/register`
2. **Login** - Sign in at `/login`
3. **Dashboard** - View portfolio overview
4. **Holdings** - Add/edit/delete stock holdings
5. **Transactions** - Record and track transactions
6. **Profile** - Access user settings (coming soon)

## Development Tips

### Enable Redux DevTools (Optional)
For debugging Zustand state, use browser DevTools with the Zustand middleware.

### API Request Interceptors
Axios automatically:
- Injects JWT token in Authorization header
- Redirects to `/login` on 401 Unauthorized
- Handles error responses

### Form Validation
React Hook Form provides:
- Real-time validation
- Minimal re-renders
- Custom validators (email, password, stock symbols)

## Deployment

### Deploy to Vercel
1. Connect GitHub repository to Vercel
2. Set environment variables in Vercel dashboard:
   ```
   VITE_API_URL=https://api.stocks.sahilfolio.live/api
   ```
3. Vercel auto-detects Vite and builds accordingly

### Deploy to Netlify
1. Build locally: `npm run build`
2. Deploy `dist` folder
3. Set environment variables in Netlify dashboard

## Troubleshooting

### API Connection Issues
- Check `VITE_API_URL` in `.env`
- Verify backend is running at the API URL
- Check browser console for CORS errors

### Authentication Not Working
- Clear localStorage and cookies
- Check JWT token in local storage
- Verify backend JWT secret matches

### Chart Not Displaying
- Ensure Recharts is installed: `npm list recharts`
- Check data format matches expected structure
- Verify API returns correct data

## Next Steps

- [ ] User profile page
- [ ] Password reset functionality
- [ ] Stock price alerts
- [ ] Export portfolio to CSV
- [ ] Advanced analytics and reports
- [ ] Mobile app with React Native
- [ ] Dark mode support

## Support

For issues or questions, check the backend API documentation at the API URL or contact support.
