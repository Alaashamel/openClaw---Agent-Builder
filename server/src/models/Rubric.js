import mongoose from 'mongoose';

const rubricCriterionSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    weight: { type: Number, default: 1, min: 0.1, max: 10 },
    maxScore: { type: Number, default: 5, min: 1, max: 10 }
  },
  { _id: true }
);

const rubricSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    criteria: { type: [rubricCriterionSchema], default: [] },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    isDefault: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export const Rubric = mongoose.model('Rubric', rubricSchema);
