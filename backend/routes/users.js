const express = require('express');
const pool = require('../db');
const auth = require('../middleware/auth');
const router = express.Router();

// Tüm kullanıcıları getir (kendisi hariç)
router.get('/', auth, async (req, res) => {
  try {
    const users = await pool.query(
      'SELECT id, username, avatar_url FROM users WHERE id != $1',
      [req.user.userId]
    );
    res.json(users.rows);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/me', auth, async (req, res) => {
  try {
    const user = await pool.query('SELECT id, username, email, avatar_url, bio FROM users WHERE id = $1', [req.user.userId]);
    res.json(user.rows[0]);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.put('/me', auth, async (req, res) => {
  try {
    const { username, bio, avatar_url } = req.body;
    await pool.query(
      'UPDATE users SET username = $1, bio = $2, avatar_url = $3 WHERE id = $4',
      [username, bio, avatar_url, req.user.userId]
    );
    res.json({ success: true });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
