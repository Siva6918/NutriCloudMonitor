import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide product name'],
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: [true, 'Please provide price'],
      min: 0,
    },
    category: {
      type: String,
      enum: ['Protein', 'Vitamins', 'Supplements', 'Snacks', 'Equipment'],
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    stock: {
      type: Number,
      required: true,
      default: 0,
    },
    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 4,
    },
    recommendedFor: {
      type: [String],
      enum: ['Underweight', 'Normal', 'Overweight', 'Obese'],
      default: [],
    },
  },
  { timestamps: true }
);

export default mongoose.model('Product', productSchema);
