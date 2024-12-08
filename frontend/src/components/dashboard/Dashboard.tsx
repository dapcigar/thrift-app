import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Settings, Sun, Moon, CreditCard, Users } from 'lucide-react';

const Dashboard: React.FC = () => {
  const [theme, setTheme] = useState('light');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const themes = {
    light: {
      bg: 'bg-gray-50',
      card: 'bg-white',
      text: 'text-gray-900',
      border: 'border-gray-200'
    },
    dark: {
      bg: 'bg-gray-900',
      card: 'bg-gray-800',
      text: 'text-white',
      border: 'border-gray-700'
    }
  };

  const currentTheme = themes[theme];

  return (
    <div className={`min-h-screen ${currentTheme.bg} transition-colors duration-300`}>
      <header className={`${currentTheme.card} border-b ${currentTheme.border} shadow-sm`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <span className={`text-xl font-bold ${currentTheme.text}`}>ThriftApp</span>
            </div>

            <div className="flex items-center space-x-4">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleTheme}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                {theme === 'light' ? <Moon /> : <Sun />}
              </motion.button>

              <div className="relative">
                <Bell className={`h-6 w-6 ${currentTheme.text}`} />
                <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                  3
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((item) => (
            <motion.div
              key={item}
              whileHover={{ y: -4 }}
              className={`${currentTheme.card} rounded-lg shadow-lg p-6`}
            >
              <h3 className={`text-lg font-medium ${currentTheme.text}`}>
                Card Title
              </h3>
              <p className="mt-2 text-gray-500 dark:text-gray-400">
                Sample content for card {item}
              </p>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;