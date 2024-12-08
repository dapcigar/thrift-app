import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';

interface AuthRequest extends Request {
  user?: any;
}

export const generateToken = (userId: string): string => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET!,
    { expiresIn: '7d' }
  );
};

export const authenticateUser = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    // Get token from header
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      throw new Error();
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
    
    // Find user
    const user = await User.findById(decoded.id)
      .select('-password')
      .lean();

    if (!user) {
      throw new Error();
    }

    // Check if user is active
    if (user.status !== 'ACTIVE') {
      return res.status(403).json({
        error: 'Account is not active'
      });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Please authenticate' });
  }
};

export const requireAdmin = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (req.user?.role !== 'ADMIN') {
      return res.status(403).json({
        error: 'Admin access required'
      });
    }
    next();
  } catch (error) {
    res.status(403).json({ error: 'Access denied' });
  }
};

export const requireGroupAdmin = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const groupId = req.params.groupId;
    const userId = req.user?._id;

    const group = await Group.findById(groupId);
    
    if (!group) {
      return res.status(404).json({ error: 'Group not found' });
    }

    const isGroupAdmin = group.members.some(
      member => member.userId.toString() === userId.toString() && 
                member.role === 'ADMIN'
    );

    if (!isGroupAdmin && group.coordinator.toString() !== userId.toString()) {
      return res.status(403).json({
        error: 'Group admin access required'
      });
    }

    next();
  } catch (error) {
    res.status(403).json({ error: 'Access denied' });
  }
};

export const validateGroupMembership = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const groupId = req.params.groupId;
    const userId = req.user?._id;

    const group = await Group.findById(groupId);
    
    if (!group) {
      return res.status(404).json({ error: 'Group not found' });
    }

    const isMember = group.members.some(
      member => member.userId.toString() === userId.toString() && 
                member.status === 'ACTIVE'
    );

    if (!isMember && group.coordinator.toString() !== userId.toString()) {
      return res.status(403).json({
        error: 'Active group membership required'
      });
    }

    next();
  } catch (error) {
    res.status(403).json({ error: 'Access denied' });
  }
};