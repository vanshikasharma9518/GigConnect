const mongoose = require('mongoose');

const courseSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a course title'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please add a course description'],
    },
    cost: {
      type: Number,
      required: [true, 'Please add a cost in coins'],
      min: [150, 'Cost must be at least 150 coins'],
      max: [300, 'Cost must not exceed 300 coins'],
    },
    content: {
      type: String,
      required: [true, 'Please add course content'],
    },
    category: {
      type: String,
      required: [true, 'Please add a category'],
    },
    thumbnailUrl: {
      type: String,
      default: 'default-course.jpg',
    },
    enrolledUsers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Virtual for enrollment count
courseSchema.virtual('enrollmentCount').get(function () {
  return this.enrolledUsers.length;
});

// Make virtuals available when converting to JSON
courseSchema.set('toJSON', { virtuals: true });
courseSchema.set('toObject', { virtuals: true });

const Course = mongoose.model('Course', courseSchema);

module.exports = Course; 