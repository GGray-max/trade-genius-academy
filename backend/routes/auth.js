const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { verifyUser, isAdmin } = require('../middleware/auth');
const { authLimiter, apiLimiter } = require('../middleware/rateLimiter');
const supabase = require('../config/supabase');

const router = express.Router();

// Apply rate limiting to auth routes
router.use('/login', authLimiter);
router.use('/signup', authLimiter);
router.use('/forgot-password', authLimiter);

// Generate reset token
const generateResetToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

// Forgot password endpoint
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        error: 'Email is required'
      });
    }

    // Check if user exists
    const { data: user, error: userError } = await supabase
      .from('profiles')
      .select('id, email, username')
      .eq('email', email)
      .single();

    if (userError || !user) {
      // Don't reveal if email exists or not for security
      return res.status(200).json({
        success: true,
        message: 'If the email exists, a reset link has been sent'
      });
    }

    // Generate reset token
    const resetToken = generateResetToken();
    const tokenExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now

    // Store reset token in database
    const { error: tokenError } = await supabase
      .from('password_resets')
      .upsert({
        user_id: user.id,
        email: email,
        token: resetToken,
        expires_at: tokenExpiry.toISOString(),
        used: false
      });

    if (tokenError) {
      console.error('Error storing reset token:', tokenError);
      return res.status(500).json({
        success: false,
        error: 'Failed to process password reset request'
      });
    }

    // In production, send email here
    // For development, log the reset link
    const resetLink = `${process.env.FRONTEND_URL || 'http://localhost:8080'}/reset-password?token=${resetToken}&email=${encodeURIComponent(email)}`;

    console.log('Password reset link:', resetLink);
    console.log('Reset token:', resetToken);

    // TODO: Send email with reset link
    // await sendPasswordResetEmail(email, user.name, resetLink);

    res.status(200).json({
      success: true,
      message: 'Password reset link sent to your email',
      // Remove this in production - only for development
      ...(process.env.NODE_ENV === 'development' && { resetLink })
    });

  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Verify reset token endpoint
router.post('/verify-reset-token', async (req, res) => {
  try {
    const { token, email } = req.body;

    if (!token || !email) {
      return res.status(400).json({
        valid: false,
        error: 'Token and email are required'
      });
    }

    // Check if token exists and is valid
    const { data: resetRecord, error } = await supabase
      .from('password_resets')
      .select('*')
      .eq('token', token)
      .eq('email', email)
      .eq('used', false)
      .single();

    if (error || !resetRecord) {
      return res.status(400).json({
        valid: false,
        error: 'Invalid reset token'
      });
    }

    // Check if token has expired
    const now = new Date();
    const expiryDate = new Date(resetRecord.expires_at);

    if (now > expiryDate) {
      return res.status(400).json({
        valid: false,
        error: 'Reset token has expired'
      });
    }

    res.status(200).json({
      valid: true
    });

  } catch (error) {
    console.error('Verify reset token error:', error);
    res.status(500).json({
      valid: false,
      error: 'Internal server error'
    });
  }
});

// Reset password endpoint
router.post('/reset-password', async (req, res) => {
  try {
    const { token, email, password } = req.body;

    if (!token || !email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Token, email, and password are required'
      });
    }

    // Validate password strength
    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        error: 'Password must be at least 8 characters long'
      });
    }

    // Check if token exists and is valid
    const { data: resetRecord, error: tokenError } = await supabase
      .from('password_resets')
      .select('*')
      .eq('token', token)
      .eq('email', email)
      .eq('used', false)
      .single();

    if (tokenError || !resetRecord) {
      return res.status(400).json({
        success: false,
        error: 'Invalid or expired reset token'
      });
    }

    // Check if token has expired
    const now = new Date();
    const expiryDate = new Date(resetRecord.expires_at);

    if (now > expiryDate) {
      return res.status(400).json({
        success: false,
        error: 'Reset token has expired'
      });
    }

    // Hash new password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Update user password
    const { error: updateError } = await supabase.auth.updateUser({
      email: email,
      password: hashedPassword,
    })

    if (updateError) {
      console.error('Error updating password:', updateError);
      return res.status(500).json({
        success: false,
        error: 'Failed to update password'
      });
    }

    // Mark token as used
    const { error: markUsedError } = await supabase
      .from('password_resets')
      .update({ used: true, used_at: new Date().toISOString() })
      .eq('id', resetRecord.id);

    if (markUsedError) {
      console.error('Error marking token as used:', markUsedError);
      // Don't fail the request for this
    }

    res.status(200).json({
      success: true,
      message: 'Password reset successfully'
    });

  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

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