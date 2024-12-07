import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { CreateGroup } from '@/components/groups/CreateGroup';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

describe('CreateGroup Component', () => {
  const queryClient = new QueryClient();

  beforeEach(() => {
    render(
      <QueryClientProvider client={queryClient}>
        <CreateGroup />
      </QueryClientProvider>
    );
  });

  it('renders all form fields', () => {
    expect(screen.getByLabelText(/Group Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Number of Members/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Contribution Amount/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Frequency/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Start Date/i)).toBeInTheDocument();
  });

  it('validates required fields', async () => {
    const submitButton = screen.getByRole('button', { name: /create group/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/Group name is required/i)).toBeInTheDocument();
    });
  });

  it('submits form with valid data', async () => {
    const groupName = screen.getByLabelText(/Group Name/i);
    const membersInput = screen.getByLabelText(/Number of Members/i);
    const amountInput = screen.getByLabelText(/Contribution Amount/i);
    const frequencySelect = screen.getByLabelText(/Frequency/i);
    const startDateInput = screen.getByLabelText(/Start Date/i);

    fireEvent.change(groupName, { target: { value: 'Test Group' } });
    fireEvent.change(membersInput, { target: { value: '10' } });
    fireEvent.change(amountInput, { target: { value: '100' } });
    fireEvent.change(frequencySelect, { target: { value: 'MONTHLY' } });
    fireEvent.change(startDateInput, { target: { value: '2024-12-31' } });

    const submitButton = screen.getByRole('button', { name: /create group/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.queryByText(/Group name is required/i)).not.toBeInTheDocument();
    });
  });
});