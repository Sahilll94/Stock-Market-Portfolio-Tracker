import mongoose from 'mongoose';

const holdingSchema = new mongoose.Schema(
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
    purchasePrice: {
      type: Number,
      required: [true, 'Purchase price is required'],
      min: [0, 'Purchase price cannot be negative']
    },
    quantity: {
      type: Number,
      required: [true, 'Quantity is required'],
      min: [1, 'Quantity must be at least 1']
    },
    purchaseDate: {
      type: Date,
      required: [true, 'Purchase date is required']
    }
  },
  {
    timestamps: true
  }
);

// Index for faster queries
holdingSchema.index({ userId: 1, symbol: 1 });

const Holding = mongoose.model('Holding', holdingSchema);
export default Holding;
