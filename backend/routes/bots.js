
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

// Get all bots (public endpoint)
router.get('/', async (req, res) => {
  try {
    const { strategy, risk_level, market } = req.query;
    
    let query = supabase
      .from('bots')
      .select(`
        *,
        creator:admin_id (id, username, avatar_url)
      `);
    
    // Apply filters
    if (strategy) query = query.eq('strategy', strategy);
    if (risk_level) query = query.eq('risk_level', risk_level);
    if (market) query = query.eq('market', market);
    
    // Only return active bots for public endpoint
    query = query.eq('is_active', true);
    
    const { data, error } = await query;
    
    if (error) {
      return res.status(400).json({ message: error.message });
    }
    
    res.status(200).json({ bots: data });
  } catch (error) {
    console.error('Error fetching bots:', error);
    res.status(500).json({ message: 'Server error while fetching bots' });
  }
});

// Get all bots (admin endpoint with inactive bots)
router.get('/admin', isAdmin, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('bots')
      .select(`
        *,
        creator:admin_id (id, username, avatar_url)
      `);
    
    if (error) {
      return res.status(400).json({ message: error.message });
    }
    
    res.status(200).json({ bots: data });
  } catch (error) {
    console.error('Error fetching bots:', error);
    res.status(500).json({ message: 'Server error while fetching bots' });
  }
});

// Get bot by ID
router.get('/:botId', async (req, res) => {
  try {
    const { botId } = req.params;
    
    const { data, error } = await supabase
      .from('bots')
      .select(`
        *,
        creator:admin_id (id, username, avatar_url)
      `)
      .eq('id', botId)
      .single();
    
    if (error) {
      return res.status(400).json({ message: error.message });
    }
    
    if (!data) {
      return res.status(404).json({ message: 'Bot not found' });
    }
    
    res.status(200).json({ bot: data });
  } catch (error) {
    console.error('Error fetching bot details:', error);
    res.status(500).json({ message: 'Server error while fetching bot details' });
  }
});

// Create new bot (admin only)
router.post('/', isAdmin, async (req, res) => {
  try {
    const { 
      name, description, strategy, risk_level, market, 
      price_monthly, price_yearly, currency, tags 
    } = req.body;
    
    const adminId = req.headers['user-id'];
    
    const { data, error } = await supabase
      .from('bots')
      .insert([{ 
        name, 
        description, 
        strategy, 
        risk_level, 
        market,
        admin_id: adminId,
        price_monthly, 
        price_yearly, 
        currency,
        tags,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select();
    
    if (error) {
      return res.status(400).json({ message: error.message });
    }
    
    res.status(201).json({ 
      message: 'Bot created successfully',
      bot: data[0]
    });
  } catch (error) {
    console.error('Error creating bot:', error);
    res.status(500).json({ message: 'Server error while creating bot' });
  }
});

// Update bot (admin only)
router.put('/:botId', isAdmin, async (req, res) => {
  try {
    const { botId } = req.params;
    const { 
      name, description, strategy, risk_level, market, 
      price_monthly, price_yearly, currency, tags, is_active 
    } = req.body;
    
    const adminId = req.headers['user-id'];
    
    // Check if bot exists and admin owns it
    const { data: botData, error: botError } = await supabase
      .from('bots')
      .select('admin_id')
      .eq('id', botId)
      .single();
    
    if (botError) {
      return res.status(400).json({ message: botError.message });
    }
    
    if (!botData) {
      return res.status(404).json({ message: 'Bot not found' });
    }
    
    // Check if the admin is the owner of this bot
    const { data: adminRole, error: roleError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', adminId)
      .single();
    
    if (roleError) {
      return res.status(400).json({ message: roleError.message });
    }
    
    // Allow super admins to edit any bot
    if (botData.admin_id !== adminId && adminRole.role !== 'super_admin') {
      return res.status(403).json({ message: 'Unauthorized to update this bot' });
    }
    
    const updateData = {
      updated_at: new Date().toISOString()
    };
    
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (strategy !== undefined) updateData.strategy = strategy;
    if (risk_level !== undefined) updateData.risk_level = risk_level;
    if (market !== undefined) updateData.market = market;
    if (price_monthly !== undefined) updateData.price_monthly = price_monthly;
    if (price_yearly !== undefined) updateData.price_yearly = price_yearly;
    if (currency !== undefined) updateData.currency = currency;
    if (tags !== undefined) updateData.tags = tags;
    if (is_active !== undefined) updateData.is_active = is_active;
    
    const { data, error } = await supabase
      .from('bots')
      .update(updateData)
      .eq('id', botId)
      .select();
    
    if (error) {
      return res.status(400).json({ message: error.message });
    }
    
    res.status(200).json({ 
      message: 'Bot updated successfully',
      bot: data[0]
    });
  } catch (error) {
    console.error('Error updating bot:', error);
    res.status(500).json({ message: 'Server error while updating bot' });
  }
});

// Delete bot (admin only)
router.delete('/:botId', isAdmin, async (req, res) => {
  try {
    const { botId } = req.params;
    const adminId = req.headers['user-id'];
    
    // Check if bot exists and admin owns it
    const { data: botData, error: botError } = await supabase
      .from('bots')
      .select('admin_id')
      .eq('id', botId)
      .single();
    
    if (botError) {
      return res.status(400).json({ message: botError.message });
    }
    
    if (!botData) {
      return res.status(404).json({ message: 'Bot not found' });
    }
    
    // Check if the admin is the owner of this bot
    const { data: adminRole, error: roleError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', adminId)
      .single();
    
    if (roleError) {
      return res.status(400).json({ message: roleError.message });
    }
    
    // Allow super admins to delete any bot
    if (botData.admin_id !== adminId && adminRole.role !== 'super_admin') {
      return res.status(403).json({ message: 'Unauthorized to delete this bot' });
    }
    
    const { error } = await supabase
      .from('bots')
      .delete()
      .eq('id', botId);
    
    if (error) {
      return res.status(400).json({ message: error.message });
    }
    
    res.status(200).json({ message: 'Bot deleted successfully' });
  } catch (error) {
    console.error('Error deleting bot:', error);
    res.status(500).json({ message: 'Server error while deleting bot' });
  }
});

// Toggle bot active status (admin only)
router.patch('/:botId/toggle-status', isAdmin, async (req, res) => {
  try {
    const { botId } = req.params;
    const adminId = req.headers['user-id'];
    
    // Check if bot exists and get current status
    const { data: botData, error: botError } = await supabase
      .from('bots')
      .select('admin_id, is_active')
      .eq('id', botId)
      .single();
    
    if (botError) {
      return res.status(400).json({ message: botError.message });
    }
    
    if (!botData) {
      return res.status(404).json({ message: 'Bot not found' });
    }
    
    // Check if the admin is the owner of this bot
    const { data: adminRole, error: roleError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', adminId)
      .single();
    
    if (roleError) {
      return res.status(400).json({ message: roleError.message });
    }
    
    // Allow super admins to toggle any bot
    if (botData.admin_id !== adminId && adminRole.role !== 'super_admin') {
      return res.status(403).json({ message: 'Unauthorized to update this bot' });
    }
    
    // Toggle the status
    const newStatus = !botData.is_active;
    
    const { data, error } = await supabase
      .from('bots')
      .update({ 
        is_active: newStatus,
        updated_at: new Date().toISOString()
      })
      .eq('id', botId)
      .select();
    
    if (error) {
      return res.status(400).json({ message: error.message });
    }
    
    res.status(200).json({ 
      message: `Bot ${newStatus ? 'activated' : 'deactivated'} successfully`,
      bot: data[0]
    });
  } catch (error) {
    console.error('Error toggling bot status:', error);
    res.status(500).json({ message: 'Server error while updating bot status' });
  }
});

module.exports = router;
