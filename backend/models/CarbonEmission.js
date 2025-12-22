import mongoose from 'mongoose';

const carbonEmissionSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    transport: {
      type: Number,
      default: 0,
    },
    food: {
      type: Number,
      default: 0,
    },
    energy: {
      type: Number,
      default: 0,
    },
    shopping: {
      type: Number,
      default: 0,
    },
    total: {
      type: Number,
      default: 0,
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient date queries
carbonEmissionSchema.index({ user: 1, date: 1 });

const CarbonEmission = mongoose.model('CarbonEmission', carbonEmissionSchema);

export default CarbonEmission;









