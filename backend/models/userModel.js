const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a name'],
    },
    email: {
      type: String,
      required: [true, 'Please add an email'],
      unique: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please add a valid email',
      ],
    },
    password: {
      type: String,
      required: [true, 'Please add a password'],
    },
    phone: {
      type: String,
      required: [true, 'Please add a phone number'],
    },
    age: {
      type: Number,
      required: [true, 'Please add your age'],
    },
    profilePic: {
      type: String,
      default: 'default-profile.jpg',
    },
    skills: {
      type: [String],
      required: [true, 'Please add at least one skill'],
    },
    location: {
      country: {
        type: String,
        required: [true, 'Please add your country'],
      },
      state: {
        type: String,
        required: [true, 'Please add your state'],
      },
      city: {
        type: String,
        required: [true, 'Please add your city'],
      },
    },
    ratings: {
      type: [Number],
      default: [],
    },
    averageRating: {
      type: Number,
      default: 3,
    },
    coins: {
      type: Number,
      default: 50,
    },
    level: {
      type: Number,
      default: 0,
    },
    redeemedCourses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Calculate average rating when ratings are modified
userSchema.pre('save', async function (next) {
  if (this.isModified('ratings') && this.ratings.length > 0) {
    const sum = this.ratings.reduce((acc, rating) => acc + rating, 0);
    this.averageRating = sum / this.ratings.length;
  }
  next();
});

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to compare entered password with hashed password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User; 