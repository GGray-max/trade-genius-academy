
const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');

// Middleware to check authentication
const verifyUser = async (req, res, next) => {
  try {
    const userId = req.headers['user-id'];
    
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized access' });
    }
    
    // Verify the user exists
    const { data, error } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', userId)
      .single();
    
    if (error || !data) {
      return res.status(401).json({ message: 'User not found' });
    }
    
    next();
  } catch (error) {
    console.error('Auth verification error:', error);
    res.status(500).json({ message: 'Server error during authorization' });
  }
};

// Middleware to verify admin role
const isAdmin = async (req, res, next) => {
  try {
    const userId = req.headers['user-id'];
    const { data, error } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .single();
    
    if (error || !data) {
      return res.status(401).json({ message: 'Unauthorized access' });
    }
    
    if (data.role !== 'admin') {
      return res.status(403).json({ message: 'Admin privileges required' });
    }
    
    next();
  } catch (error) {
    console.error('Admin verification error:', error);
    res.status(500).json({ message: 'Server error during authorization' });
  }
};

// Create bot request (for users)
router.post('/', verifyUser, async (req, res) => {
  try {
    const { 
      title, description, strategy, risk_level, market, 
      budget, admin_id 
    } = req.body;
    
    const userId = req.headers['user-id'];
    
    const { data, error } = await supabase
      .from('bot_requests')
      .insert([{
        user_id: userId,
        title,
        description,
        strategy,
        risk_level,
        market,
        budget: budget || null,
        admin_id: admin_id || null,
        status: 'pending',
        created_at: new Date().toISOString()
      }])
      .select();
    
    if (error) {
      return res.status(400).json({ message: error.message });
    }
    
    res.status(201).json({
      message: 'Bot request submitted successfully',
      request: data[0]
    });
  } catch (error) {
    console.error('Error creating bot request:', error);
    res.status(500).json({ message: 'Server error while creating bot request' });
  }
});

// Get user's bot requests
router.get('/user', verifyUser, async (req, res) => {
  try {
    const userId = req.headers['user-id'];
    
    const { data, error } = await supabase
      .from('bot_requests')
      .select(`
        *,
        profiles:admin_id (id, username, avatar_url)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) {
      return res.status(400).json({ message: error.message });
    }
    
    res.status(200).json({ requests: data });
  } catch (error) {
    console.error('Error fetching user bot requests:', error);
    res.status(500).json({ message: 'Server error while fetching bot requests' });
  }
});

// Get admin's assigned bot requests
router.get('/admin', isAdmin, async (req, res) => {
  try {
    const adminId = req.headers['user-id'];
    
    // Get requests assigned to this admin OR not assigned to any admin
    const { data, error } = await supabase
      .from('bot_requests')
      .select(`
        *,
        user:user_id (id, username, email, avatar_url)
      `)
      .or(`admin_id.eq.${adminId},admin_id.is.null`)
      .order('created_at', { ascending: false });
    
    if (error) {
      return res.status(400).json({ message: error.message });
    }
    
    res.status(200).json({ requests: data });
  } catch (error) {
    console.error('Error fetching admin bot requests:', error);
    res.status(500).json({ message: 'Server error while fetching bot requests' });
  }
});

// Get all bot requests (admin only)
router.get('/all', isAdmin, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('bot_requests')
      .select(`
        *,
        user:user_id (id, username, email, avatar_url),
        admin:admin_id (id, username)
      `)
      .order('created_at', { ascending: false });
    
    if (error) {
      return res.status(400).json({ message: error.message });
    }
    
    res.status(200).json({ requests: data });
  } catch (error) {
    console.error('Error fetching all bot requests:', error);
    res.status(500).json({ message: 'Server error while fetching bot requests' });
  }
});

// Get bot request by ID
router.get('/:requestId', verifyUser, async (req, res) => {
  try {
    const { requestId } = req.params;
    const userId = req.headers['user-id'];
    
    // Get the user's role
    const { data: userData, error: userError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .single();
    
    if (userError) {
      return res.status(400).json({ message: userError.message });
    }
    
    let query = supabase
      .from('bot_requests')
      .select(`
        *,
        user:user_id (id, username, email, avatar_url),
        admin:admin_id (id, username)
      `)
      .eq('id', requestId);
    
    // If not admin, only allow viewing own requests
    if (userData.role !== 'admin') {
      query = query.eq('user_id', userId);
    }
    
    const { data, error } = await query.single();
    
    if (error) {
      return res.status(400).json({ message: error.message });
    }
    
    if (!data) {
      return res.status(404).json({ message: 'Bot request not found or you don\'t have permission to view it' });
    }
    
    res.status(200).json({ request: data });
  } catch (error) {
    console.error('Error fetching bot request details:', error);
    res.status(500).json({ message: 'Server error while fetching bot request details' });
  }
});

// Update bot request status (admin only)
router.patch('/:requestId/status', isAdmin, async (req, res) => {
  try {
    const { requestId } = req.params;
    const { status } = req.body;
    
    if (!['pending', 'in_progress', 'completed', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }
    
    const { data, error } = await supabase
      .from('bot_requests')
      .update({ status })
      .eq('id', requestId)
      .select();
    
    if (error) {
      return res.status(400).json({ message: error.message });
    }
    
    if (data.length === 0) {
      return res.status(404).json({ message: 'Bot request not found' });
    }
    
    res.status(200).json({
      message: `Request status updated to ${status}`,
      request: data[0]
    });
  } catch (error) {
    console.error('Error updating bot request status:', error);
    res.status(500).json({ message: 'Server error while updating request status' });
  }
});

// Assign bot request to admin (admin only)
router.patch('/:requestId/assign', isAdmin, async (req, res) => {
  try {
    const { requestId } = req.params;
    const adminId = req.headers['user-id'];
    
    const { data, error } = await supabase
      .from('bot_requests')
      .update({ admin_id: adminId })
      .eq('id', requestId)
      .select();
    
    if (error) {
      return res.status(400).json({ message: error.message });
    }
    
    if (data.length === 0) {
      return res.status(404).json({ message: 'Bot request not found' });
    }
    
    res.status(200).json({
      message: 'Bot request assigned successfully',
      request: data[0]
    });
  } catch (error) {
    console.error('Error assigning bot request:', error);
    res.status(500).json({ message: 'Server error while assigning request' });
  }
});

module.exports = router;
