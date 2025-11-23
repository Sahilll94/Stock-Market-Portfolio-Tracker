import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { validateStockSymbol, validatePositiveNumber } from '../../utils/validators';
import { TRANSACTION_TYPES } from '../../utils/constants';

export default function TransactionForm({ onSubmit, isSubmitting }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      symbol: '',
      type: 'BUY',
      quantity: '',
      price: '',
      transactionDate: new Date().toISOString().split('T')[0],
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

    if (!validatePositiveNumber(data.price)) {
      toast.error('Price must be a positive number');
      return;
    }

    await onSubmit({
      symbol: data.symbol.toUpperCase(),
      type: data.type,
      quantity: parseFloat(data.quantity),
      price: parseFloat(data.price),
      transactionDate: data.transactionDate,
    });

    reset();
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
      {/* Symbol Field */}
      <div>
        <label className="label">Stock Symbol</label>
        <input
          type="text"
          {...register('symbol', { required: 'Symbol is required' })}
          className={`input ${errors.symbol ? 'input-error' : ''}`}
          placeholder="AAPL, GOOGL, etc."
        />
        {errors.symbol && <span className="error-text">{errors.symbol.message}</span>}
      </div>

      {/* Type Field */}
      <div>
        <label className="label">Transaction Type</label>
        <select
          {...register('type', { required: 'Type is required' })}
          className={`input ${errors.type ? 'input-error' : ''}`}
        >
          {TRANSACTION_TYPES.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
        {errors.type && <span className="error-text">{errors.type.message}</span>}
      </div>

      {/* Quantity Field */}
      <div>
        <label className="label">Quantity</label>
        <input
          type="number"
          step="0.01"
          {...register('quantity', { required: 'Quantity is required' })}
          className={`input ${errors.quantity ? 'input-error' : ''}`}
          placeholder="10"
        />
        {errors.quantity && <span className="error-text">{errors.quantity.message}</span>}
      </div>

      {/* Price Field */}
      <div>
        <label className="label">Price per Share (₹)</label>
        <input
          type="number"
          step="0.01"
          {...register('price', { required: 'Price is required' })}
          className={`input ${errors.price ? 'input-error' : ''}`}
          placeholder="150.50"
        />
        {errors.price && <span className="error-text">{errors.price.message}</span>}
      </div>

      {/* Date Field */}
      <div>
        <label className="label">Transaction Date</label>
        <input
          type="date"
          {...register('transactionDate', { required: 'Date is required' })}
          className={`input ${errors.transactionDate ? 'input-error' : ''}`}
        />
        {errors.transactionDate && (
          <span className="error-text">{errors.transactionDate.message}</span>
        )}
      </div>

      {/* Submit Button */}
      <button type="submit" disabled={isSubmitting} className="btn-primary w-full">
        {isSubmitting ? 'Adding...' : 'Add Transaction'}
      </button>
    </form>
  );
}
