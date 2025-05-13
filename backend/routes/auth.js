
const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');

// User Sign Up
router.post('/signup', async (req, res) => {
  try {
    const { email, password, username } = req.body;

    if (!email || !password || !username) {
      return res.status(400).json({ message: 'Email, password, and username are required' });
    }

    // Create auth user
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto confirm the email for testing purposes
      user_metadata: { username }
    });

    if (authError) {
      return res.status(400).json({ message: authError.message });
    }

    if (authData.user) {
      // Create profile entry
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([
          {
            id: authData.user.id,
            username,
            email,
            role: 'user',
            created_at: new Date().toISOString()
          }
        ]);

      if (profileError) {
        // Rollback the user creation if profile creation fails
        await supabase.auth.admin.deleteUser(authData.user.id);
        return res.status(400).json({ message: profileError.message });
      }

      return res.status(201).json({
        message: 'User created successfully',
        user: {
          id: authData.user.id,
          email: authData.user.email,
          username
        }
      });
    }
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: 'Server error during signup' });
  }
});

// User Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return res.status(401).json({ message: error.message });
    }

    // Get user profile
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .single();

    if (profileError) {
      return res.status(400).json({ message: profileError.message });
    }

    return res.status(200).json({
      message: 'Login successful',
      session: data.session,
      user: {
        ...data.user,
        username: profileData.username,
        role: profileData.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// Validate Session
router.post('/validate-session', async (req, res) => {
  try {
    const { session_token } = req.body;
    
    if (!session_token) {
      return res.status(400).json({ message: 'Session token is required' });
    }

    const { data, error } = await supabase.auth.getSession(session_token);

    if (error || !data.session) {
      return res.status(401).json({ message: 'Invalid or expired session' });
    }

    // Get user profile
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.session.user.id)
      .single();

    if (profileError) {
      return res.status(400).json({ message: profileError.message });
    }

    return res.status(200).json({
      message: 'Session valid',
      session: data.session,
      user: {
        ...data.session.user,
        username: profileData.username,
        role: profileData.role
      }
    });
  } catch (error) {
    console.error('Session validation error:', error);
    res.status(500).json({ message: 'Server error during session validation' });
  }
});

// Logout
router.post('/logout', async (req, res) => {
  try {
    const { session_token } = req.body;
    
    if (!session_token) {
      return res.status(400).json({ message: 'Session token is required' });
    }

    const { error } = await supabase.auth.admin.signOut(session_token);

    if (error) {
      return res.status(400).json({ message: error.message });
    }

    return res.status(200).json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ message: 'Server error during logout' });
  }
});

module.exports = router;
