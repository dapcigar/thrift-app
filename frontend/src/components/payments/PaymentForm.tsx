import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

interface PaymentFormProps {
  groupId: string;
  amount: number;
}

export const PaymentForm: React.FC<PaymentFormProps> = ({ groupId, amount }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const queryClient = useQueryClient();

  const { mutate: makePayment, isError } = useMutation(
    async () => {
      const response = await axios.post('/api/payments', {
        groupId,
        amount
      });
      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['payments', groupId]);
      }
    }
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    try {
      await makePayment();
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-white shadow sm:rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          Make Payment
        </h3>
        <div className="mt-2 max-w-xl text-sm text-gray-500">
          <p>Your contribution amount is ${amount}</p>
        </div>
        <form onSubmit={handleSubmit} className="mt-5">
          <div className="mt-5">
            <button
              type="submit"
              disabled={isProcessing}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {isProcessing ? 'Processing...' : 'Make Payment'}
            </button>
          </div>
          {isError && (
            <div className="mt-2 text-sm text-red-600">
              Payment failed. Please try again.
            </div>
          )}
        </form>
      </div>
    </div>
  );
};