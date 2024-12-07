import { setupServer } from 'msw/node';
import { rest } from 'msw';

export const handlers = [
  // Auth endpoints
  rest.post('/api/auth/login', (req, res, ctx) => {
    return res(
      ctx.json({
        token: 'mock-token',
        user: {
          id: '1',
          email: 'test@example.com',
          firstName: 'Test',
          lastName: 'User'
        }
      })
    );
  }),

  // Group endpoints
  rest.get('/api/groups/:id', (req, res, ctx) => {
    return res(
      ctx.json({
        id: req.params.id,
        name: 'Test Group',
        totalMembers: 10,
        contributionAmount: 100,
        frequency: 'MONTHLY',
        nextPayout: '2024-12-31',
        totalSaved: 1000,
        members: [
          { id: '1', name: 'John Doe', status: 'ACTIVE' },
          { id: '2', name: 'Jane Smith', status: 'PENDING' }
        ]
      })
    );
  }),

  rest.post('/api/groups', (req, res, ctx) => {
    return res(
      ctx.status(201),
      ctx.json({
        id: 'new-group-id',
        ...req.body
      })
    );
  }),

  // Payment endpoints
  rest.get('/api/payments/group/:groupId', (req, res, ctx) => {
    return res(
      ctx.json([
        {
          id: '1',
          amount: 100,
          status: 'PAID',
          paidDate: '2024-12-01',
          dueDate: '2024-12-01'
        },
        {
          id: '2',
          amount: 100,
          status: 'PENDING',
          dueDate: '2024-12-31'
        }
      ])
    );
  }),

  rest.post('/api/payments', (req, res, ctx) => {
    return res(
      ctx.status(201),
      ctx.json({
        id: 'new-payment-id',
        status: 'PAID',
        paidDate: new Date().toISOString(),
        ...req.body
      })
    );
  })
];

export const server = setupServer(...handlers);