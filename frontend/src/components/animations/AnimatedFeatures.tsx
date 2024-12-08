import React, { useState } from 'react';
import { motion, AnimateSharedLayout } from 'framer-motion';
import { 
  Check,
  Clock,
  Calendar
} from 'lucide-react';

const AnimatedFeatures: React.FC = () => {
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const payments = [
    { id: '1', amount: 100, dueDate: '2024-12-15', status: 'pending' },
    { id: '2', amount: 100, dueDate: '2024-11-15', status: 'completed' },
    { id: '3', amount: 100, dueDate: '2024-10-15', status: 'completed' }
  ];

  return (
    <div className="p-4 space-y-6">
      <AnimateSharedLayout>
        <div className="space-y-4">
          {payments.map((payment) => (
            <motion.div
              key={payment.id}
              layoutId={payment.id}
              onClick={() => setExpandedCard(expandedCard === payment.id ? null : payment.id)}
              className={`bg-white rounded-lg shadow cursor-pointer overflow-hidden ${
                expandedCard === payment.id ? 'p-6' : 'p-4'
              }`}
            >
              <motion.div layout className="flex justify-between items-center">
                <div>
                  <motion.h3 layout className="text-lg font-medium text-gray-900">
                    ${payment.amount}
                  </motion.h3>
                  <motion.p layout className="text-sm text-gray-500">
                    Due: {payment.dueDate}
                  </motion.p>
                </div>
                <motion.div layout>
                  {payment.status === 'completed' ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      <Check className="h-4 w-4 mr-1" />
                      Completed
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      <Clock className="h-4 w-4 mr-1" />
                      Pending
                    </span>
                  )}
                </motion.div>
              </motion.div>

              {expandedCard === payment.id && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4 pt-4 border-t"
                >
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Service Fee (1.5%)</span>
                      <span className="text-gray-900">${(payment.amount * 0.015).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Total Amount</span>
                      <span className="text-gray-900 font-medium">
                        ${(payment.amount * 1.015).toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {payment.status === 'pending' && (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="mt-4 w-full py-2 bg-blue-600 text-white rounded-lg"
                    >
                      Pay Now
                    </motion.button>
                  )}
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </AnimateSharedLayout>

      {/* Animated Calendar */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="grid grid-cols-7 gap-2">
          {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
            <motion.button
              key={day}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setSelectedDate(`2024-12-${day}`)}
              className={`aspect-square rounded-lg flex items-center justify-center ${
                selectedDate === `2024-12-${day}`
                  ? 'bg-blue-600 text-white'
                  : 'hover:bg-blue-50'
              }`}
            >
              {day}
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnimatedFeatures;