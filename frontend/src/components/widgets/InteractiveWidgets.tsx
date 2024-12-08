import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronDown, 
  Plus, 
  Check,
  X,
  DollarSign,
  Share2,
  Copy
} from 'lucide-react';

const InteractiveWidgets = () => {
  const [activeWidget, setActiveWidget] = useState('invite');
  const [copied, setCopied] = useState(false);
  const [showToast, setShowToast] = useState(false);

  // Group Invite Modal
  const InviteWidget = () => {
    const [inviteLink, setInviteLink] = useState('https://thriftapp.com/join/abc123');
    
    const handleCopy = async () => {
      await navigator.clipboard.writeText(inviteLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      setShowToast(true);
    };

    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-lg p-6"
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">Invite Members</h3>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-2 rounded-full hover:bg-gray-100"
            onClick={() => setActiveWidget(null)}
          >
            <X className="h-5 w-5 text-gray-500" />
          </motion.button>
        </div>

        <div className="space-y-4">
          <div className="relative">
            <input
              type="text"
              value={inviteLink}
              readOnly
              className="w-full pr-20 py-2 pl-4 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleCopy}
              className="absolute right-2 top-1.5 px-3 py-1 bg-blue-50 text-blue-600 rounded-md flex items-center"
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              <span className="ml-1 text-sm">{copied ? 'Copied!' : 'Copy'}</span>
            </motion.button>
          </div>

          <div className="flex space-x-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex-1 py-2 bg-blue-600 text-white rounded-lg flex items-center justify-center"
            >
              <Share2 className="h-4 w-4 mr-2" />
              Share Link
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex-1 py-2 border border-gray-300 rounded-lg flex items-center justify-center"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add by Email
            </motion.button>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex space-x-2">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setActiveWidget('invite')}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg"
        >
          Show Invite Widget
        </motion.button>
      </div>

      <AnimatePresence mode="wait">
        {activeWidget === 'invite' && <InviteWidget />}
      </AnimatePresence>

      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            onAnimationComplete={() => {
              setTimeout(() => setShowToast(false), 2000);
            }}
            className="fixed bottom-4 right-4 bg-black bg-opacity-80 text-white px-4 py-2 rounded-lg"
          >
            Link copied!
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default InteractiveWidgets;