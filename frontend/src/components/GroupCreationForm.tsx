import React, { useState } from 'react';
import { Users, Plus, X } from 'lucide-react';

interface GroupFormData {
  name: string;
  contributionAmount: string;
  frequency: 'WEEKLY' | 'BIWEEKLY' | 'MONTHLY';
  startDate: string;
  totalMembers: string;
  description: string;
  members: Array<{ email: string; role: 'ADMIN' | 'MEMBER' }>;
}

interface GroupFormProps {
  onSubmit: (formData: GroupFormData) => Promise<void>;
}

export default function CreateGroupForm({ onSubmit }: GroupFormProps) {
  const [formData, setFormData] = useState<GroupFormData>({
    name: '',
    contributionAmount: '',
    frequency: 'MONTHLY',
    startDate: '',
    totalMembers: '',
    description: '',
    members: [{ email: '', role: 'MEMBER' }]
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await onSubmit(formData);
    } catch (err) {
      setError('Failed to create group. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const addMember = () => {
    setFormData({
      ...formData,
      members: [...formData.members, { email: '', role: 'MEMBER' }]
    });
  };

  const removeMember = (index: number) => {
    setFormData({
      ...formData,
      members: formData.members.filter((_, i) => i !== index)
    });
  };

  const updateMember = (index: number, field: 'email' | 'role', value: string) => {
    const newMembers = [...formData.members];
    newMembers[index] = { ...newMembers[index], [field]: value as any };
    setFormData({ ...formData, members: newMembers });
  };

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Create New Savings Group</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="rounded-md bg-red-50 p-4">
            <div className="flex">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">{error}</h3>
              </div>
            </div>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Group Name
          </label>
          <input
            type="text"
            required
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            rows={3}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
          />
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Contribution Amount ($)
            </label>
            <input
              type="number"
              required
              min="0"
              step="0.01"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              value={formData.contributionAmount}
              onChange={(e) => setFormData({...formData, contributionAmount: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Frequency
            </label>
            <select
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              value={formData.frequency}
              onChange={(e) => setFormData({...formData, frequency: e.target.value as any})}
            >
              <option value="WEEKLY">Weekly</option>
              <option value="BIWEEKLY">Bi-weekly</option>
              <option value="MONTHLY">Monthly</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Start Date
            </label>
            <input
              type="date"
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              value={formData.startDate}
              onChange={(e) => setFormData({...formData, startDate: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Total Members
            </label>
            <input
              type="number"
              required
              min="2"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              value={formData.totalMembers}
              onChange={(e) => setFormData({...formData, totalMembers: e.target.value})}
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">Members</h3>
            <button
              type="button"
              onClick={addMember}
              className="flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Member
            </button>
          </div>

          {formData.members.map((member, index) => (
            <div key={index} className="flex items-center space-x-4">
              <input
                type="email"
                placeholder="Email address"
                className="flex-1 border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                value={member.email}
                onChange={(e) => updateMember(index, 'email', e.target.value)}
              />
              <select
                className="border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                value={member.role}
                onChange={(e) => updateMember(index, 'role', e.target.value)}
              >
                <option value="MEMBER">Member</option>
                <option value="ADMIN">Admin</option>
              </select>
              {index > 0 && (
                <button
                  type="button"
                  onClick={() => removeMember(index)}
                  className="text-red-600 hover:text-red-800"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>
          ))}
        </div>

        <div>
          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            {loading ? (
              <Users className="h-5 w-5 animate-spin" />
            ) : (
              'Create Group'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}