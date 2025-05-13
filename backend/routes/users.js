
const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');

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

// Get all admins
router.get('/admins', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, username, email, avatar_url')
      .eq('role', 'admin');
    
    if (error) {
      return res.status(400).json({ message: error.message });
    }
    
    res.status(200).json({ admins: data });
  } catch (error) {
    console.error('Error fetching admins:', error);
    res.status(500).json({ message: 'Server error while fetching admins' });
  }
});

// Get user profile
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error) {
      return res.status(400).json({ message: error.message });
    }
    
    if (!data) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.status(200).json({ user: data });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ message: 'Server error while fetching user profile' });
  }
});

// Update user profile
router.put('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { username, avatar_url } = req.body;
    
    const requestingUserId = req.headers['user-id'];
    
    // Check if the user is updating their own profile or is an admin
    const { data: userRole, error: roleError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', requestingUserId)
      .single();
    
    if (roleError) {
      return res.status(400).json({ message: roleError.message });
    }
    
    if (requestingUserId !== userId && userRole.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized to update this profile' });
    }
    
    const updateData = {};
    if (username) updateData.username = username;
    if (avatar_url) updateData.avatar_url = avatar_url;
    
    const { data, error } = await supabase
      .from('profiles')
      .update(updateData)
      .eq('id', userId)
      .select();
    
    if (error) {
      return res.status(400).json({ message: error.message });
    }
    
    res.status(200).json({ 
      message: 'Profile updated successfully',
      user: data[0]
    });
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({ message: 'Server error while updating user profile' });
  }
});

// Admin only: Change user role
router.patch('/:userId/role', isAdmin, async (req, res) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;
    
    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role specified' });
    }
    
    const { data, error } = await supabase
      .from('profiles')
      .update({ role })
      .eq('id', userId)
      .select();
    
    if (error) {
      return res.status(400).json({ message: error.message });
    }
    
    res.status(200).json({ 
      message: `User role changed to ${role} successfully`,
      user: data[0]
    });
  } catch (error) {
    console.error('Error updating user role:', error);
    res.status(500).json({ message: 'Server error while updating user role' });
  }
});

module.exports = router;
