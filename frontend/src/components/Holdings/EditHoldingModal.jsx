import { useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import HoldingForm from './HoldingForm';
import { X } from 'lucide-react';

export default function EditHoldingModal({ isOpen, holding, onClose, onUpdate, isSubmitting }) {
  const { isDark } = useTheme();
  const [isLoading, setIsLoading] = useState(false);

  const handleUpdate = async (data) => {
    setIsLoading(true);
    try {
      await onUpdate(holding._id, data);
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen || !holding) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className={`${isDark ? 'bg-gray-900 border border-gray-800' : 'bg-white border border-gray-200'} rounded-lg shadow-2xl max-w-md w-full p-6 transition-all duration-300`}>
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Edit Holding: {holding.symbol}</h2>
          <button
            onClick={onClose}
            className={`p-1 rounded-lg transition-all duration-300 ${isDark ? 'hover:bg-gray-800 text-gray-400 hover:text-gray-300' : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'}`}
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <HoldingForm
          holding={holding}
          onSubmit={handleUpdate}
          isSubmitting={isSubmitting || isLoading}
        />

        {/* Footer */}
        <button
          onClick={onClose}
          className={`w-full mt-4 py-2 text-sm font-medium rounded-lg transition-all duration-300 ${
            isDark
              ? 'text-gray-400 hover:text-gray-300 hover:bg-gray-800'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
          }`}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
