import { AlertTriangle, X } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

export default function ConfirmDeleteModal({ isOpen, onConfirm, onCancel, itemName = 'this item', isDeleting = false }) {
  const { isDark } = useTheme();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50 transition-all duration-300">
      <div className={`${isDark ? 'bg-gray-900 border border-gray-700/50' : 'bg-white border border-gray-200/50'} rounded-xl shadow-2xl max-w-sm w-full p-6 transition-all duration-300 transform scale-100 opacity-100`}>
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-lg ${isDark ? 'bg-red-500/15' : 'bg-red-100'}`}>
              <AlertTriangle size={24} className={isDark ? 'text-red-400' : 'text-red-600'} />
            </div>
            <div>
              <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Confirm Delete</h3>
              <p className={`text-xs uppercase tracking-wide font-semibold ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>This action cannot be undone</p>
            </div>
          </div>
          <button
            onClick={onCancel}
            className={`p-1.5 rounded-lg transition-all duration-300 hover:scale-110 ${isDark ? 'hover:bg-gray-800 text-gray-400 hover:text-gray-300' : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'}`}
            disabled={isDeleting}
          >
            <X size={20} />
          </button>
        </div>

        {/* Message */}
        <div className="mb-6">
          <p className={`text-base transition-colors ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            Are you sure you want to delete <span className={`font-semibold ${isDark ? 'text-red-400' : 'text-red-600'}`}>{itemName}</span>?
          </p>
          <p className={`text-sm mt-3 transition-colors ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>
            This holding will be permanently removed from your portfolio. You won't be able to recover it.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            disabled={isDeleting}
            className={`flex-1 py-3 rounded-lg font-semibold transition-all duration-300 border-2 ${
              isDark
                ? 'text-gray-400 border-gray-700 hover:text-gray-300 hover:bg-gray-800/50 hover:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed'
                : 'text-gray-600 border-gray-200 hover:text-gray-900 hover:bg-gray-50 hover:border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed'
            }`}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className={`flex-1 py-3 rounded-lg font-semibold transition-all duration-300 text-white flex items-center justify-center gap-2 ${
              isDeleting
                ? 'bg-red-600 cursor-not-allowed opacity-75'
                : 'bg-red-600 hover:bg-red-700 active:scale-95 shadow-lg shadow-red-500/20'
            }`}
          >
            {isDeleting ? (
              <>
                <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-r-transparent"></span>
                <span>Deleting...</span>
              </>
            ) : (
              'Delete'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
