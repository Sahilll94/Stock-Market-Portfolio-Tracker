import mongoose from 'mongoose';

const priceCacheSchema = new mongoose.Schema(
  {
    symbol: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true
    },
    price: {
      type: Number,
      required: true
    },
    updatedAt: {
      type: Date,
      default: Date.now,
      expires: 3600 // TTL: Cache expires after 1 hour (3600 seconds)
    }
  }
);

const PriceCache = mongoose.model('PriceCache', priceCacheSchema);
export default PriceCache;
