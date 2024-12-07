import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Check, Clock, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import axios from 'axios';

interface Payment {
  id: string;
  amount: number;
  dueDate: string;
  paidDate?: string;
  status: 'PENDING' | 'PAID' | 'OVERDUE';
}

export const PaymentHistory: React.FC<{ groupId: string }> = ({ groupId }) => {
  const { data: payments, isLoading } = useQuery(
    ['payments', groupId],
    async () => {
      const response = await axios.get(`/api/payments/group/${groupId}`);
      return response.data;
    }
  );

  if (isLoading) return <div>Loading...</div>;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PAID':
        return <Check className="w-5 h-5 text-green-500" />;
      case 'PENDING':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'OVERDUE':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          Payment History
        </h3>
      </div>
      <div className="border-t border-gray-200">
        <ul className="divide-y divide-gray-200">
          {payments?.map((payment: Payment) => (
            <li key={payment.id} className="px-4 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  {getStatusIcon(payment.status)}
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">
                      ${payment.amount}
                    </p>
                    <p className="text-sm text-gray-500">
                      Due: {format(new Date(payment.dueDate), 'PPP')}
                    </p>
                  </div>
                </div>
                {payment.paidDate && (
                  <p className="text-sm text-gray-500">
                    Paid: {format(new Date(payment.paidDate), 'PPP')}
                  </p>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};