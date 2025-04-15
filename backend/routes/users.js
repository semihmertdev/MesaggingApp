const express = require('express');
const pool = require('../db');
const auth = require('../middleware/auth');
const router = express.Router();

// Tüm kullanıcıları getir (kendisi hariç)
router.get('/', auth, async (req, res) => {
  try {
    const users = await pool.query(
      'SELECT id, username, email, avatar_url FROM users WHERE id != $1',
      [req.user.id]
    );
    res.json(users.rows);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Kullanıcılar alınırken bir hata oluştu' });
  }
});

router.get('/me', auth, async (req, res) => {
  try {
    const user = await pool.query(
      'SELECT id, username, email, avatar_url, bio FROM users WHERE id = $1',
      [req.user.id]
    );
    res.json(user.rows[0]);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Kullanıcı bilgileri alınamadı' });
  }
});

router.put('/me', auth, async (req, res) => {
  try {
    const { username, bio, avatar_url } = req.body;
    const updatedUser = await pool.query(
      'UPDATE users SET username = COALESCE($1, username), bio = COALESCE($2, bio), avatar_url = COALESCE($3, avatar_url) WHERE id = $4 RETURNING id, username, email, avatar_url, bio',
      [username, bio, avatar_url, req.user.id]
    );
    res.json(updatedUser.rows[0]);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Kullanıcı bilgileri güncellenirken bir hata oluştu' });
  }
});

module.exports = router;
