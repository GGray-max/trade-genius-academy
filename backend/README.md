
# TradeWizard Backend

Node.js backend for the TradeWizard trading bot platform. This server handles authentication, user management, and trading bot functionalities.

## Setup

1. Clone the repository
2. Install dependencies: `npm install`
3. Create a `.env` file in the backend directory with the following variables:
   ```
   PORT=5000
   SUPABASE_URL=your_supabase_url
   SUPABASE_SERVICE_KEY=your_supabase_service_key
   ```
4. Start the development server: `npm run dev`
5. For production: `npm start`

## Database Structure

### Tables Required in Supabase

1. **profiles**
   - id (UUID, primary key, references auth.users.id)
   - username (text, not null)
   - email (text, not null)
   - role (text, default: 'user')
   - avatar_url (text, nullable)
   - created_at (timestamp with timezone)

2. **bots**
   - id (UUID, primary key)
   - name (text, not null)
   - description (text)
   - strategy (text)
   - risk_level (text)
   - market (text)
   - admin_id (UUID, references profiles.id)
   - price_monthly (numeric)
   - price_yearly (numeric)
   - currency (text)
   - tags (text array)
   - is_active (boolean, default: true)
   - created_at (timestamp with timezone)
   - updated_at (timestamp with timezone)

3. **bot_requests**
   - id (UUID, primary key)
   - user_id (UUID, references profiles.id)
   - admin_id (UUID, references profiles.id, nullable)
   - title (text, not null)
   - description (text)
   - strategy (text)
   - risk_level (text)
   - market (text)
   - budget (text, nullable)
   - status (text, default: 'pending')
   - created_at (timestamp with timezone)

## API Endpoints

### Authentication
- POST `/api/auth/signup` - Register a new user
- POST `/api/auth/login` - Sign in a user
- POST `/api/auth/validate-session` - Validate user session
- POST `/api/auth/logout` - Sign out a user

### Users
- GET `/api/users/admins` - Get all admins
- GET `/api/users/:userId` - Get user profile
- PUT `/api/users/:userId` - Update user profile
- PATCH `/api/users/:userId/role` - Change user role (admin only)

### Bots
- GET `/api/bots` - Get all active bots
- GET `/api/bots/admin` - Get all bots (admin only)
- GET `/api/bots/:botId` - Get bot by ID
- POST `/api/bots` - Create a new bot (admin only)
- PUT `/api/bots/:botId` - Update bot (admin only)
- DELETE `/api/bots/:botId` - Delete bot (admin only)
- PATCH `/api/bots/:botId/toggle-status` - Toggle bot active status (admin only)

### Bot Requests
- POST `/api/bot-requests` - Create bot request
- GET `/api/bot-requests/user` - Get user's bot requests
- GET `/api/bot-requests/admin` - Get admin's assigned bot requests
- GET `/api/bot-requests/all` - Get all bot requests (admin only)
- GET `/api/bot-requests/:requestId` - Get bot request by ID
- PATCH `/api/bot-requests/:requestId/status` - Update bot request status (admin only)
- PATCH `/api/bot-requests/:requestId/assign` - Assign bot request to admin (admin only)
