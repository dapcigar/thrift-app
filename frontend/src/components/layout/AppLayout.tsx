import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Settings, Sun, Moon } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';

interface AppLayoutProps {
  children: React.ReactNode;
  title?: string;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children, title }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className={`min-h-screen ${theme.bg} transition-colors duration-300`}>
      <header className={`${theme.card} border-b ${theme.border} shadow-sm`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <span className={`text-xl font-bold ${theme.text}`}>
                {title || 'ThriftApp'}
              </span>
            </div>

            <div className="flex items-center space-x-4">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleTheme}
                className={`p-2 rounded-full ${theme.hover}`}
              >
                {theme === themes.light ? <Moon /> : <Sun />}
              </motion.button>

              <div className="relative">
                <Bell className={`h-6 w-6 ${theme.text}`} />
                <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                  3
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
};

export default AppLayout;