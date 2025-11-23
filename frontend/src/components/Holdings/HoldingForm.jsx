import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { validateStockSymbol, validatePositiveNumber } from '../../utils/validators';
import DatePicker from './DatePicker';

export default function HoldingForm({ holding = null, onSubmit, isSubmitting }) {
  const { isDark } = useTheme();
  const [purchaseDateValue, setPurchaseDateValue] = useState(
    holding?.purchaseDate 
      ? new Date(holding.purchaseDate).toISOString().split('T')[0]
      : new Date().toISOString().split('T')[0]
  );
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm({
    defaultValues: {
      symbol: holding?.symbol || '',
      quantity: holding?.quantity || '',
      purchasePrice: holding?.purchasePrice || '',
      purchaseDate: purchaseDateValue,
    },
  });

  const onFormSubmit = async (data) => {
    if (!validateStockSymbol(data.symbol)) {
      toast.error('Invalid stock symbol format');
      return;
    }

    if (!validatePositiveNumber(data.quantity)) {
      toast.error('Quantity must be a positive number');
      return;
    }

    if (!validatePositiveNumber(data.purchasePrice)) {
      toast.error('Price must be a positive number');
      return;
    }

    if (!data.purchaseDate) {
      toast.error('Purchase date is required');
      return;
    }

    await onSubmit({
      symbol: data.symbol.toUpperCase(),
      quantity: parseFloat(data.quantity),
      purchasePrice: parseFloat(data.purchasePrice),
      purchaseDate: data.purchaseDate,
    });

    reset();
  };

  const inputClasses = (hasError) => `
    w-full px-3 py-2 rounded-lg border-2 transition-all duration-300
    ${isDark 
      ? `bg-gray-800/50 border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 ${hasError ? 'border-red-500' : ''}`
      : `bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 ${hasError ? 'border-red-500' : ''}`
    }
  `;

  const labelClasses = `text-sm font-semibold mb-2 transition-colors ${isDark ? 'text-gray-300' : 'text-gray-700'}`;

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-5">
      {/* Symbol Field */}
      <div className="group">
        <label className={`${labelClasses} uppercase text-xs tracking-widest`}>Stock Symbol</label>
        <input
          type="text"
          {...register('symbol', { required: 'Symbol is required' })}
          className={inputClasses(!!errors.symbol)}
          placeholder="AAPL, GOOGL, etc."
          disabled={!!holding}
        />
        {errors.symbol && <span className={`text-xs mt-2 block font-medium transition-colors ${isDark ? 'text-red-400' : 'text-red-600'}`}>✕ {errors.symbol.message}</span>}
      </div>

      {/* Quantity Field */}
      <div className="group">
        <label className={`${labelClasses} uppercase text-xs tracking-widest`}>Quantity</label>
        <input
          type="number"
          step="0.01"
          {...register('quantity', { required: 'Quantity is required' })}
          className={inputClasses(!!errors.quantity)}
          placeholder="10"
        />
        {errors.quantity && <span className={`text-xs mt-2 block font-medium transition-colors ${isDark ? 'text-red-400' : 'text-red-600'}`}>✕ {errors.quantity.message}</span>}
      </div>

      {/* Average Price Field */}
      <div className="group">
        <label className={`${labelClasses} uppercase text-xs tracking-widest`}>Purchase Price (₹)</label>
        <input
          type="number"
          step="0.01"
          {...register('purchasePrice', { required: 'Price is required' })}
          className={inputClasses(!!errors.purchasePrice)}
          placeholder="150.50"
        />
        {errors.purchasePrice && (
          <span className={`text-xs mt-2 block font-medium transition-colors ${isDark ? 'text-red-400' : 'text-red-600'}`}>✕ {errors.purchasePrice.message}</span>
        )}
      </div>

      {/* Purchase Date Field */}
      <div className="group">
        <label className={`${labelClasses} uppercase text-xs tracking-widest`}>Purchase Date</label>
        <DatePicker 
          value={purchaseDateValue}
          onChange={(date) => {
            setPurchaseDateValue(date);
            setValue('purchaseDate', date);
          }}
          error={!!errors.purchaseDate}
        />
        {errors.purchaseDate && (
          <span className={`text-xs mt-2 block font-medium transition-colors ${isDark ? 'text-red-400' : 'text-red-600'}`}>✕ {errors.purchaseDate.message}</span>
        )}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className={`w-full py-3 rounded-lg font-semibold transition-all duration-300 text-white mt-6 hover:shadow-lg active:scale-95 ${
          isSubmitting
            ? isDark ? 'bg-gray-600 cursor-not-allowed' : 'bg-gray-400 cursor-not-allowed'
            : isDark 
              ? 'bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/20'
              : 'bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/20'
        }`}
      >
        {isSubmitting ? (
          <span className="flex items-center justify-center gap-2">
            <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-r-transparent"></span>
            <span>{holding ? 'Updating...' : 'Adding...'}</span>
          </span>
        ) : (
          <span className="flex items-center justify-center gap-2">
            <span>{holding ? 'Update Holding' : 'Add Holding'}</span>
          </span>
        )}
      </button>
    </form>
  );
}
