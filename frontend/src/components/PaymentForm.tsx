import React, { useState } from 'react';
import { CreditCard, Loader, CheckCircle, AlertCircle } from 'lucide-react';

interface PaymentProps {
  groupName: string;
  dueAmount: number;
  dueDate: string;
  onSubmitPayment: (amount: number) => Promise<void>;
}

export default function PaymentForm({ groupName, dueAmount, dueDate, onSubmitPayment }: PaymentProps) {
  const [amount, setAmount] = useState(dueAmount.toString());
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setStatus('idle');

    try {
      await onSubmitPayment(parseFloat(amount));
      setStatus('success');
    } catch (err) {
      setStatus('error');
      setError('Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white shadow rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Make Payment</h2>
        <CreditCard className="h-6 w-6 text-gray-400" />
      </div>

      <div className="mb-6">
        <div className="text-sm text-gray-600">Group</div>
        <div className="text-lg font-medium text-gray-900">{groupName}</div>
        <div className="mt-1 text-sm text-gray-600">Due: ${dueAmount} by {dueDate}</div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Payment Amount
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-sm">$</span>
            </div>
            <input
              type="number"
              required
              min="0"
              step="0.01"
              className="pl-7 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
        </div>

        {status === 'success' && (
          <div className="rounded-md bg-green-50 p-4">
            <div className="flex">
              <CheckCircle className="h-5 w-5 text-green-400" />
              <div className="ml-3">
                <h3 className="text-sm font-medium text-green-800">
                  Payment successful!
                </h3>
              </div>
            </div>
          </div>
        )}

        {status === 'error' && (
          <div className="rounded-md bg-red-50 p-4">
            <div className="flex">
              <AlertCircle className="h-5 w-5 text-red-400" />
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">{error}</h3>
              </div>
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={loading || status === 'success'}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400"
        >
          {loading ? (
            <Loader className="h-5 w-5 animate-spin" />
          ) : status === 'success' ? (
            'Payment Complete'
          ) : (
            'Submit Payment'
          )}
        </button>
      </form>
    </div>
  );
}