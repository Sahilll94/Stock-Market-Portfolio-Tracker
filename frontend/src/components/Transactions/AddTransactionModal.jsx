import { useState } from 'react';
import TransactionForm from './TransactionForm';

export default function AddTransactionModal({ isOpen, onClose, onAdd, isSubmitting }) {
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 max-h-96 overflow-y-auto">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Add Transaction</h2>
        <TransactionForm onSubmit={handleAdd} isSubmitting={isSubmitting || isLoading} />
        <button
          onClick={onClose}
          className="w-full mt-4 text-gray-600 hover:text-gray-900 font-medium"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
