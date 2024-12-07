import express from 'express';
import { PaymentService } from '../services/paymentService';
import { NotificationService } from '../services/notificationService';
import { authenticateUser } from '../middleware/auth';

const router = express.Router();
const notificationService = new NotificationService();
const paymentService = new PaymentService(notificationService);

// Record payment
router.post('/', authenticateUser, async (req: any, res) => {
  try {
    const payment = await paymentService.recordPayment(
      req.user.id,
      req.body.groupId,
      req.body.amount
    );
    res.status(201).json(payment);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get group payments
router.get('/group/:groupId', authenticateUser, async (req, res) => {
  try {
    const payments = await paymentService.getGroupPayments(req.params.groupId);
    res.json(payments);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

// Get user payments
router.get('/user', authenticateUser, async (req: any, res) => {
  try {
    const payments = await paymentService.getUserPayments(req.user.id);
    res.json(payments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;