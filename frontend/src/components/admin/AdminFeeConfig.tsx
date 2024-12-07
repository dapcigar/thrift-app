import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

interface AdminFeeConfigProps {
  config: {
    serviceFeePercentage: number;
    flatFee: number;
    minimumFee: number;
    maximumFee: number;
    isPercentageBased: boolean;
  };
}

export const AdminFeeConfig: React.FC<AdminFeeConfigProps> = ({ config }) => {
  const [formData, setFormData] = useState(config);
  const queryClient = useQueryClient();

  const { mutate: updateConfig, isLoading } = useMutation(
    async (data: typeof formData) => {
      const response = await axios.post('/api/admin/fees/config', data);
      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['admin-fee-config']);
      }
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateConfig(formData);
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-lg font-medium text-gray-900 mb-4">
        Fee Configuration
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-center">
          <input
            type="checkbox"
            id="isPercentageBased"
            checked={formData.isPercentageBased}
            onChange={(e) => setFormData({
              ...formData,
              isPercentageBased: e.target.checked
            })}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="isPercentageBased" className="ml-2 block text-sm text-gray-900">
            Use Percentage-based Fee
          </label>
        </div>

        {formData.isPercentageBased ? (
          <div>
            <label htmlFor="serviceFeePercentage" className="block text-sm font-medium text-gray-700">
              Service Fee Percentage
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <input
                type="number"
                id="serviceFeePercentage"
                value={formData.serviceFeePercentage}
                onChange={(e) => setFormData({
                  ...formData,
                  serviceFeePercentage: parseFloat(e.target.value)
                })}
                className="focus:ring-blue-500 focus:border-blue-500 block w-full px-4 sm:text-sm border-gray-300 rounded-md"
                step="0.01"
                min="0"
                max="100"
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">%</span>
              </div>
            </div>
          </div>
        ) : (
          <div>
            <label htmlFor="flatFee" className="block text-sm font-medium text-gray-700">
              Flat Fee Amount
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">$</span>
              </div>
              <input
                type="number"
                id="flatFee"
                value={formData.flatFee}
                onChange={(e) => setFormData({
                  ...formData,
                  flatFee: parseFloat(e.target.value)
                })}
                className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
                step="0.01"
                min="0"
              />
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="minimumFee" className="block text-sm font-medium text-gray-700">
              Minimum Fee
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">$</span>
              </div>
              <input
                type="number"
                id="minimumFee"
                value={formData.minimumFee}
                onChange={(e) => setFormData({
                  ...formData,
                  minimumFee: parseFloat(e.target.value)
                })}
                className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
                step="0.01"
                min="0"
              />
            </div>
          </div>

          <div>
            <label htmlFor="maximumFee" className="block text-sm font-medium text-gray-700">
              Maximum Fee
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">$</span>
              </div>
              <input
                type="number"
                id="maximumFee"
                value={formData.maximumFee}
                onChange={(e) => setFormData({
                  ...formData,
                  maximumFee: parseFloat(e.target.value)
                })}
                className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
                step="0.01"
                min="0"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isLoading}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {isLoading ? 'Saving...' : 'Save Configuration'}
          </button>
        </div>
      </form>
    </div>
  );
};