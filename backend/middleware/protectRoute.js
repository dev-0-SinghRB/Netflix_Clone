import jwt from 'jsonwebtoken';
import { ENV_VARS } from '../config/envVars.js';
import { User } from '../models/user.model.js';

export async function protectRoute(req, res, next) {

    try {
        const token = req.cookies['jwt-netflix'];
        if (!token) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const decoded = jwt.verify(token, ENV_VARS.JWT_SECRET);
        if (!decoded) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized"
            })
        }
        const user = await User.findById(decoded.userId).select("-password");
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized"
            })
        }
        req.user = user;
        next();
    } catch (error) {
        return res.status(403).json({ message: 'Forbidden' });
    }
}