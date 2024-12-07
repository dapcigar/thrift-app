import express from 'express';
import { GroupService } from '../services/groupService';
import { NotificationService } from '../services/notificationService';
import { authenticateUser } from '../middleware/auth';

const router = express.Router();
const notificationService = new NotificationService();
const groupService = new GroupService(notificationService);

// Create new group
router.post('/', authenticateUser, async (req: any, res) => {
  try {
    const group = await groupService.createGroup(req.user.id, req.body);
    res.status(201).json(group);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all groups for user
router.get('/', authenticateUser, async (req: any, res) => {
  try {
    const groups = await groupService.getUserGroups(req.user.id);
    res.json(groups);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single group
router.get('/:id', authenticateUser, async (req, res) => {
  try {
    const group = await groupService.getGroupDetails(req.params.id);
    res.json(group);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

// Join group
router.post('/join', authenticateUser, async (req: any, res) => {
  try {
    const group = await groupService.joinGroup(req.user.id, req.body.inviteCode);
    res.json(group);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Generate invite code
router.post('/:id/invite', authenticateUser, async (req: any, res) => {
  try {
    const inviteCode = await groupService.generateInviteCode(
      req.params.id,
      req.user.id
    );
    res.json({ inviteCode });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;