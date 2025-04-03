const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerDocs = require('./SwaggerConfig');
const { createToken } = require('./security');

const app = express();
const users = [
    { username: 'testuser', password: 'password', id: 1, isAdmin: true }
];

app.use(cors({
    origin: "*",
    exposedHeaders: ["Authorization"] // Expose Authorization header
}));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
//test git push
/**
 * @swagger
 * /login:
 *   post:
 *     summary: User login
 *     description: Authenticate user and return a token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 token:
 *                   type: string
 *       401:
 *         description: Invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    console.log(username);
    const user = users.find(u => u.username === username && u.password === password);
    console.log(user);
    if (user) {
        const payload = { username: user.username, isAdmin: user.isAdmin };
        const token = createToken(payload);
        res.setHeader('Authorization', `${token}`);
        res.status(200).json({ message: 'Login successful', token: token });
    } else {
        res.status(401).json({ message: 'Invalid credentials' });
    }
});

app.use((req, res, next) => {
    res.status(404).json({ message: 'Not Found' });
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});