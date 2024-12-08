import React from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  CreditCard, 
  Calendar, 
  ChevronRight,
  Search,
  Filter
} from 'lucide-react';

const TabletLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="hidden md:flex lg:hidden fixed left-0 top-0 bottom-0 w-20 bg-white border-r border-gray-200">
        <div className="flex flex-col items-center w-full pt-6 space-y-8">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="w-12 h-12 rounded-xl bg-blue-500 text-white flex items-center justify-center"
          >
            <Users className="h-6 w-6" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="w-12 h-12 rounded-xl bg-gray-100 text-gray-600 flex items-center justify-center"
          >
            <CreditCard className="h-6 w-6" />
          </motion.button>
        </div>
      </div>

      <div className="md:ml-20 lg:ml-0">
        <div className="sticky top-0 z-10 md:flex lg:hidden items-center justify-between bg-white border-b border-gray-200 p-4">
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
        </div>

        <div className="p-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4].map((item) => (
            <motion.div
              key={item}
              whileHover={{ scale: 1.02 }}
              className="bg-white rounded-lg shadow p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Group Name</h3>
                  <p className="text-sm text-gray-500">12 members</p>
                </div>
                <motion.button
                  whileHover={{ x: 4 }}
                  whileTap={{ x: -2 }}
                  className="p-2 rounded-lg hover:bg-gray-100"
                >
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TabletLayout;