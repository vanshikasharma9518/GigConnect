const mongoose = require('mongoose');

const jobSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a job title'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please add a job description'],
    },
    location: {
      type: {
        lat: {
          type: Number,
          required: [true, 'Please add latitude'],
        },
        lng: {
          type: Number,
          required: [true, 'Please add longitude'],
        },
        country: {
          type: String,
          required: [true, 'Please add country'],
        },
        state: {
          type: String,
          required: [true, 'Please add state'],
        },
        city: {
          type: String,
          required: [true, 'Please add city'],
        },
      },
      required: true,
    },
    posterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: ['open', 'in-progress', 'completed', 'cancelled'],
      default: 'open',
    },
    salary: {
      type: Number,
      required: false,
    },
    deadline: {
      type: Date,
      required: false,
    },
    applicants: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        status: {
          type: String,
          enum: ['pending', 'accepted', 'rejected'],
          default: 'pending',
        },
        appliedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Virtual for applicantCount
jobSchema.virtual('applicantCount').get(function () {
  return this.applicants.length;
});

// Make virtuals available when converting to JSON
jobSchema.set('toJSON', { virtuals: true });
jobSchema.set('toObject', { virtuals: true });

const Job = mongoose.model('Job', jobSchema);

module.exports = Job; 