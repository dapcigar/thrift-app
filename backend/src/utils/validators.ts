import { z } from 'zod';

// User validation schema
export const userSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/)
});

// Group validation schema
export const groupSchema = z.object({
  name: z.string().min(3),
  totalMembers: z.number().min(2),
  contributionAmount: z.number().positive(),
  frequency: z.enum(['WEEKLY', 'BIWEEKLY', 'MONTHLY']),
  startDate: z.string().transform(str => new Date(str))
});

// Payment validation schema
export const paymentSchema = z.object({
  groupId: z.string(),
  amount: z.number().positive(),
  paymentMethod: z.string().optional()
});

// Invite validation schema
export const inviteSchema = z.object({
  email: z.string().email(),
  groupId: z.string()
});

// Validate request body
export const validateRequest = (schema: z.ZodSchema) => {
  return (req: any, res: any, next: any) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      res.status(400).json({ error: error.errors });
    }
  };
};