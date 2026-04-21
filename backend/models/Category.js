import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    description: { type: String, default: '' },
    image: { type: String, default: '' },
    icon: { type: String, default: '🪔' },
    order: { type: Number, default: 0 },
    vertical: {
      type: String,
      enum: ['devapi', 'herbal'],
      default: 'devapi',
      index: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model('Category', categorySchema);
