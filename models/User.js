const mongoose = require('mongoose');
const crypto = require('crypto-js');
const bcrypt = require('bcrypt');

// User schema
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 30
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    match: [/.+\@.+\..+/, 'Please fill a valid email address']
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  gravatarUrl: {
    type: String
  },
  favorites: [{
    type: String, // Artsy artist ID
    ref: 'Artist'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Pre-save hook to hash password
userSchema.pre('save', async function(next) {
  // Only hash the password if it's modified or new
  if (!this.isModified('password')) return next();
  
  try {
    // Generate salt and hash password
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    
    // Generate Gravatar URL
    this.gravatarUrl = this.generateGravatarUrl();
    
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare passwords
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Method to generate Gravatar URL
userSchema.methods.generateGravatarUrl = function() {
  // Create MD5 hash of the email (Gravatar uses MD5)
  const hash = crypto.MD5(this.email.trim().toLowerCase()).toString();
  
  // Return the Gravatar URL
  // Default options: s=200 (size 200px), r=g (rating G - suitable for all audiences), d=identicon (default image is an identicon)
  return `https://www.gravatar.com/avatar/${hash}?s=200&r=g&d=identicon`;
};

// Method to return user data without sensitive information
userSchema.methods.toJSON = function() {
  const user = this.toObject();
  delete user.password;
  return user;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
