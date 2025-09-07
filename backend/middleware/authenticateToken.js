import jwt from "jsonwebtoken"

export const authenticateToken = (req, res, next) => {
    let jwtToken;
    const authHeader = req.headers['authorization']
    const token = authHeader?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Unauthorized: No token' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ error: 'Forbidden: Invalid token' });
        req.user = user;
        next();
    });
} 