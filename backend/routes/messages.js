const express = require('express');
const pool = require('../db');
const auth = require('../middleware/auth');
const router = express.Router();

router.post('/', auth, async (req, res) => {
  const { receiver_id, content } = req.body;
  const message = await pool.query(
    'INSERT INTO messages (sender_id, receiver_id, content, created_at) VALUES ($1, $2, $3, NOW()) RETURNING *',
    [req.user.userId, receiver_id, content]
  );
  res.json(message.rows[0]);
});

router.get('/:withUserId', auth, async (req, res) => {
  const messages = await pool.query(
    `SELECT m.*, 
            json_build_object('id', s.id, 'username', s.username) as sender,
            json_build_object('id', r.id, 'username', r.username) as receiver
     FROM messages m
     JOIN users s ON m.sender_id = s.id
     JOIN users r ON m.receiver_id = r.id
     WHERE (m.sender_id = $1 AND m.receiver_id = $2)
        OR (m.sender_id = $2 AND m.receiver_id = $1)
     ORDER BY m.created_at ASC`,
    [req.user.userId, req.params.withUserId]
  );
  res.json(messages.rows);
});

module.exports = router;
