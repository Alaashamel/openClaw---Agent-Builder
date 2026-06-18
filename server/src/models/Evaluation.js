import mongoose from 'mongoose';

const issueSchema = new mongoose.Schema(
  {
    type: { type: String, required: true },
    severity: { type: String, enum: ['low', 'medium', 'high', 'critical'], default: 'medium' },
    message: { type: String, required: true },
    stepIndex: { type: Number, default: null }
  },
  { _id: false }
);

const evaluationSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    trace: { type: mongoose.Schema.Types.Mixed, required: true },
    rubric: { type: mongoose.Schema.Types.Mixed, default: null },
    result: {
      score: { type: Number, default: 0 },
      grade: { type: String, default: 'Needs Review' },
      issues: { type: [issueSchema], default: [] },
      recommendations: { type: [String], default: [] },
      rubricScores: { type: [mongoose.Schema.Types.Mixed], default: [] },
      summary: { type: String, default: '' }
    },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
  },
  { timestamps: true }
);

export const Evaluation = mongoose.model('Evaluation', evaluationSchema);
