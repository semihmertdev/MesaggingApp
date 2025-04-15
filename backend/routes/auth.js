const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../db');
const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Input validasyonu
    if (!username || !email || !password) {
      return res.status(400).json({ 
        error: 'Tüm alanlar zorunludur',
        details: {
          username: !username ? 'Kullanıcı adı gerekli' : null,
          email: !email ? 'Email gerekli' : null,
          password: !password ? 'Şifre gerekli' : null
        }
      });
    }

    // Email formatı kontrolü
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Geçerli bir email adresi giriniz' });
    }

    // Email benzersizlik kontrolü
    const existingUser = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: 'Bu email adresi zaten kullanımda' });
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = await pool.query(
      'INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING id, username, email',
      [username, email, hashed]
    );
    
    res.json(user.rows[0]);
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Kayıt işlemi sırasında bir hata oluştu' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Input validasyonu
    if (!email || !password) {
      return res.status(400).json({ 
        error: 'Email ve şifre gerekli',
        details: {
          email: !email ? 'Email gerekli' : null,
          password: !password ? 'Şifre gerekli' : null
        }
      });
    }

    // Email formatı kontrolü
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Geçerli bir email adresi giriniz' });
    }

    const user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (!user.rows.length) {
      return res.status(400).json({ error: 'Bu email adresi ile kayıtlı kullanıcı bulunamadı' });
    }

    const valid = await bcrypt.compare(password, user.rows[0].password_hash);
    if (!valid) {
      return res.status(400).json({ error: 'Hatalı şifre' });
    }

    const token = jwt.sign({ userId: user.rows[0].id }, process.env.JWT_SECRET);
    res.json({ token });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Giriş işlemi sırasında bir hata oluştu' });
  }
});

module.exports = router;
