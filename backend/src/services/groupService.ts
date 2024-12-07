import { Group, IGroup } from '../models/Group';
import { User } from '../models/User';
import { NotificationService } from './notificationService';
import { generateInviteCode } from '../utils/helpers';

export class GroupService {
  constructor(private notificationService: NotificationService) {}

  async createGroup(coordinatorId: string, groupData: Partial<IGroup>) {
    const inviteCode = await generateInviteCode();
    
    const group = new Group({
      ...groupData,
      coordinator: coordinatorId,
      inviteCode,
      status: 'PENDING'
    });

    await group.save();
    await User.findByIdAndUpdate(coordinatorId, {
      $push: { createdGroups: group._id }
    });

    return group;
  }

  async joinGroup(userId: string, inviteCode: string) {
    const group = await Group.findOne({ inviteCode });
    if (!group) throw new Error('Invalid invite code');
    if (group.members.length >= group.totalMembers) {
      throw new Error('Group is full');
    }

    const isMember = group.members.some(m => m.userId.toString() === userId);
    if (isMember) throw new Error('Already a member');

    group.members.push({
      userId,
      status: 'PENDING',
      joinedAt: new Date()
    });

    if (group.members.length === group.totalMembers) {
      group.status = 'ACTIVE';
      await this.generatePayoutSchedule(group);
    }

    await group.save();
    await User.findByIdAndUpdate(userId, {
      $push: { memberGroups: group._id }
    });

    return group;
  }

  private async generatePayoutSchedule(group: IGroup) {
    const members = [...group.members];
    const payoutSchedule = [];
    let currentDate = new Date(group.startDate);

    for (let i = 0; i < members.length; i++) {
      payoutSchedule.push({
        userId: members[i].userId,
        scheduledDate: new Date(currentDate),
        status: 'PENDING'
      });

      switch (group.frequency) {
        case 'WEEKLY':
          currentDate.setDate(currentDate.getDate() + 7);
          break;
        case 'BIWEEKLY':
          currentDate.setDate(currentDate.getDate() + 14);
          break;
        case 'MONTHLY':
          currentDate.setMonth(currentDate.getMonth() + 1);
          break;
      }
    }

    group.payoutSchedule = payoutSchedule;
    group.endDate = currentDate;
    await group.save();
  }
}