import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required']
    },
    symbol: {
      type: String,
      required: [true, 'Stock symbol is required'],
      uppercase: true,
      trim: true
    },
    type: {
      type: String,
      enum: ['BUY', 'SELL'],
      required: [true, 'Transaction type is required']
    },
    quantity: {
      type: Number,
      required: [true, 'Quantity is required'],
      min: [1, 'Quantity must be at least 1']
    },
    pricePerShare: {
      type: Number,
      required: [true, 'Price per share is required'],
      min: [0, 'Price cannot be negative']
    },
    totalValue: {
      type: Number,
      required: [true, 'Total value is required']
    },
    date: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: false // We use 'date' field instead
  }
);

// Index for faster queries
transactionSchema.index({ userId: 1, date: -1 });
transactionSchema.index({ userId: 1, symbol: 1 });

const Transaction = mongoose.model('Transaction', transactionSchema);
export default Transaction;
