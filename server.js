// server.js

const express = require('express');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3001;

app.use(cors());
app.use(bodyParser.json());

// Almacén temporal de usuarios
const users = [
  { id: 1, username: 'user1', password: 'password1' },
  { id: 2, username: 'user2', password: 'password2' },
];

// Secreto para firmar JWT
const secretKey = 'your-secret-key';

// Middleware para verificar el token
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ error: 'Token no proporcionado' });
  }

  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Token inválido' });
    }

    req.user = decoded.user;
    next();
  });
};

// Ruta para autenticar y generar token
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Simulación de autenticación
  const user = users.find((u) => u.username === username && u.password === password);

  if (!user) {
    return res.status(401).json({ error: 'Credenciales inválidas' });
  }

  // Generar token
  const token = jwt.sign({ user: { id: user.id, username: user.username } }, secretKey, { expiresIn: '1h' });

  res.json({ token });
});

// Ruta protegida
app.get('/protected', verifyToken, (req, res) => {
  res.json({ message: 'Tienes acceso a esta ruta protegida', user: req.user });
});

app.listen(port, () => {
  console.log(`El servidor está ejecutándose en el puerto ${port}`);
});
