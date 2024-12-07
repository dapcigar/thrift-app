import React from 'react';
import { render, screen } from '@testing-library/react';
import { GroupDashboard } from '@/components/groups/GroupDashboard';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const mockGroup = {
  id: '1',
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
};

jest.mock('axios', () => ({
  get: jest.fn(() => Promise.resolve({ data: mockGroup }))
}));

describe('GroupDashboard Component', () => {
  const queryClient = new QueryClient();

  beforeEach(() => {
    render(
      <QueryClientProvider client={queryClient}>
        <GroupDashboard groupId="1" />
      </QueryClientProvider>
    );
  });

  it('displays group information', async () => {
    expect(await screen.findByText('Test Group')).toBeInTheDocument();
    expect(await screen.findByText('10')).toBeInTheDocument();
    expect(await screen.findByText('$1,000')).toBeInTheDocument();
  });

  it('shows member list', async () => {
    expect(await screen.findByText('John Doe')).toBeInTheDocument();
    expect(await screen.findByText('Jane Smith')).toBeInTheDocument();
  });

  it('displays correct member status', async () => {
    expect(await screen.findByText('ACTIVE')).toBeInTheDocument();
    expect(await screen.findByText('PENDING')).toBeInTheDocument();
  });
});