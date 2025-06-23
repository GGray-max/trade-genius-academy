const jwt = require('jsonwebtoken');
const supabase = require('../config/supabase');

/**
 * Middleware to verify that the request is coming from an authenticated user.
 *
 * Strategy:
 * 1. Prefer an Authorization header with a Bearer JWT (issued by the backend).
 * 2. Fallback to the custom `user-id` header that the front-end currently sends.
 * 3. Ensure that the user exists in the `profiles` table (cheap DB lookup via Supabase).
 */
const verifyUser = async (req, res, next) => {
  try {
    let userId = null;

    // (1) Try JWT first
    const authHeader = req.headers['authorization'] || req.headers['Authorization'];
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'changeme');
        userId = decoded?.userId || decoded?.id;
      } catch (err) {
        // invalid token – fall through to header method
      }
    }

    // (2) Fallback – custom header populated by the front-end
    if (!userId) {
      userId = req.headers['user-id'];
    }

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized: user not identified' });
    }

    // (3) Confirm user exists in DB (optional but safer)
    const { data, error } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', userId)
      .single();

    if (error || !data) {
      return res.status(401).json({ message: 'Unauthorized: user not found' });
    }

    // Attach userId to request for downstream handlers
    req.userId = userId;
    next();
  } catch (error) {
    console.error('verifyUser middleware error:', error);
    res.status(500).json({ message: 'Server error during authorization' });
  }
};

/**
 * Middleware to ensure the authenticated user has admin privileges.
 */
const isAdmin = async (req, res, next) => {
  try {
    // ensure verifyUser has already run
    const userId = req.userId || req.headers['user-id'];
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { data, error } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .single();

    if (error || !data) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    if (data.role !== 'admin') {
      return res.status(403).json({ message: 'Admin privileges required' });
    }

    next();
  } catch (error) {
    console.error('isAdmin middleware error:', error);
    res.status(500).json({ message: 'Server error during authorization' });
  }
};

module.exports = { verifyUser, isAdmin };
