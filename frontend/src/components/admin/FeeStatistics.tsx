import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface FeeStatisticsProps {
  stats: {
    totalFees: number;
    totalTransactions: number;
    averageFee: number;
    totalAmount: number;
    monthlyTrends: Array<{
      month: string;
      fees: number;
      transactions: number;
    }>;
  };
}

export const FeeStatistics: React.FC<FeeStatisticsProps> = ({ stats }) => {
  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-lg font-medium text-gray-900 mb-4">
        Fee Statistics
      </h2>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-blue-50 rounded-lg p-4">
          <p className="text-sm text-blue-600">Total Fees Collected</p>
          <p className="mt-2 text-2xl font-semibold text-gray-900">
            ${stats.totalFees.toLocaleString()}
          </p>
        </div>

        <div className="bg-green-50 rounded-lg p-4">
          <p className="text-sm text-green-600">Total Transactions</p>
          <p className="mt-2 text-2xl font-semibold text-gray-900">
            {stats.totalTransactions.toLocaleString()}
          </p>
        </div>

        <div className="bg-purple-50 rounded-lg p-4">
          <p className="text-sm text-purple-600">Average Fee</p>
          <p className="mt-2 text-2xl font-semibold text-gray-900">
            ${stats.averageFee.toFixed(2)}
          </p>
        </div>

        <div className="bg-yellow-50 rounded-lg p-4">
          <p className="text-sm text-yellow-600">Total Transaction Amount</p>
          <p className="mt-2 text-2xl font-semibold text-gray-900">
            ${stats.totalAmount.toLocaleString()}
          </p>
        </div>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={stats.monthlyTrends}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Line 
              type="monotone" 
              dataKey="fees" 
              stroke="#3B82F6" 
              strokeWidth={2} 
              name="Fees Collected"
            />
            <Line 
              type="monotone" 
              dataKey="transactions" 
              stroke="#10B981" 
              strokeWidth={2} 
              name="Transactions"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
