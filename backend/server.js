import express from "express"
import path from "path"
import { open } from "sqlite"
import sqlite3 from "sqlite3"
import { fileURLToPath } from "url";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import dotenv from 'dotenv';
// import cors from 'cors';
import fs from "fs";


import { authenticateToken } from "./middleware/authenticateToken.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
// app.use(cors());
app.use(express.json());

const configDir = path.join(__dirname, "config");
if (!fs.existsSync(configDir)) {
    fs.mkdirSync(configDir);
}

const dbPath = path.join(__dirname, "config", "data.db");

let db = null;

const createTables = async () => {
    await db.exec(`
    CREATE TABLE IF NOT EXISTS user (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE,
      password TEXT
    );
  `);
};


const initializeDBAndServer = async () => {
    try {
        db = await open({
            filename: dbPath,
            driver: sqlite3.Database,
        });
        await createTables();
        const PORT = process.env.PORT || 4000
        app.listen(PORT, () => {
            console.log(`Server Running on port ${PORT}`);
        });
    } catch (e) {
        console.log(`DB Error: ${e.message}`);
        process.exit(1);
    }
};

initializeDBAndServer();

app.get('/check', async (req, res) => {
    res.status(200).json({ status: 'OK', message: 'Check is working' })
})

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ status: 'NOK', message: 'Username and password are required' });
    }

    try {
        const userDetails = `SELECT * FROM user WHERE username = ?;`;
        const user = await db.get(userDetails, [username]);

        if (!user) {
            return res.status(401).json({ status: 'NOK', message: 'Invalid credentials' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ status: 'NOK', message: 'Invalid credentials' });
        }

        const payload = { userId: user.id, username: user.username };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

        return res.status(200).json({
            status: 'OK',
            message: 'Login successful',
            token
        });
    } catch (error) {
        console.error("Login Error:", error.message);
        return res.status(500).json({ status: 'NOK', message: 'Internal Server Error' });
    }
});

app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ status: 'NOK', message: 'Credentials are Mandatory' })
    }
    try {
        const userDetails = `SELECT * FROM user WHERE username=?;`
        const user = await db.get(userDetails, [username])
        if (user) {
            return res.status(409).json({ status: 'NOK', message: 'User Already Exists' })
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const createUserQuery = `INSERT INTO user (username,password) VALUES (?,?)`
        const createUser = await db.run(createUserQuery, [username, hashedPassword])

        res.status(201).json({ status: 'OK', message: 'User Created Successfully', data: createUser })

    } catch (err) {
        console.log('Register Error:', err.message);
        return res.status(500).json({ status: 'NOK', message: 'Internal Server Error', error: err.message })
    }
})
