const mongoose = require('mongoose');

const marketListingSchema = new mongoose.Schema({
  sellerId: { type: String, required: true },
  sellerUsername: String,
  itemId: { type: String, required: true },
  itemName: { type: String, required: true },
  quantity: { type: Number, required: true },
  pricePerUnit: { type: Number, required: true },
  rarity: { type: String, enum: ['common', 'uncommon', 'rare', 'epic', 'legendary'] },
  createdAt: { type: Date, default: Date.now, index: true },
  expiresAt: { type: Date, default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) }
});

module.exports = mongoose.model('Market', marketListingSchema);
