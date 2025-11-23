import { useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import HoldingForm from './HoldingForm';
import { X } from 'lucide-react';

export default function AddHoldingModal({ isOpen, onClose, onAdd, isSubmitting }) {
  const { isDark } = useTheme();
  const [isLoading, setIsLoading] = useState(false);

  const handleAdd = async (data) => {
    setIsLoading(true);
    try {
      await onAdd(data);
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50 transition-all duration-300">
      <div className={`${isDark ? 'bg-gray-900 border border-gray-700/50' : 'bg-white border border-gray-200/50'} rounded-xl shadow-2xl max-w-md w-full p-6 transition-all duration-300 transform scale-100 opacity-100`}>
        {/* Header with gradient background */}
        <div className={`mb-6 pb-4 border-b-2 flex items-center justify-between ${isDark ? 'border-gray-700/50' : 'border-gray-100'}`}>
          <div>
            <h2 className={`text-2xl font-bold transition-colors ${isDark ? 'text-white' : 'text-gray-900'}`}>Add New Holding</h2>
            <p className={`text-xs uppercase tracking-wide font-semibold mt-1 transition-colors ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>Expand your portfolio</p>
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg transition-all duration-300 hover:scale-110 active:scale-95 ${isDark ? 'hover:bg-gray-800 text-gray-400 hover:text-gray-300' : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'}`}
            title="Close"
          >
            <X size={22} />
          </button>
        </div>

        {/* Form with enhanced spacing */}
        <div className="mb-4">
          <HoldingForm onSubmit={handleAdd} isSubmitting={isSubmitting || isLoading} />
        </div>

        {/* Footer */}
        <button
          onClick={onClose}
          className={`w-full py-2.5 text-sm font-medium rounded-lg transition-all duration-300 border-2 ${isDark
            ? 'text-gray-400 border-gray-700 hover:text-gray-300 hover:bg-gray-800/50 hover:border-gray-600'
            : 'text-gray-600 border-gray-200 hover:text-gray-900 hover:bg-gray-50 hover:border-gray-300'
          }`}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
