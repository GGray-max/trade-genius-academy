const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { createClient } = require('@supabase/supabase-js');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Supabase URL or Service Key is missing. Please check your .env file.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Test route
app.get('/', (req, res) => {
  res.send('TradeWizard Backend API is running');
});

// Routes
const authRoutes = require('./routes/auth');
const botRoutes = require('./routes/bots');
const userRoutes = require('./routes/users');
const botRequestRoutes = require('./routes/botRequests');

app.use('/api/auth', authRoutes);
app.use('/api/bots', botRoutes);
app.use('/api/users', userRoutes);
app.use('/api/bot-requests', botRequestRoutes);
app.use('/api/analytics', require('./routes/analytics'));

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});