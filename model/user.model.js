const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const addressSchema = new mongoose.Schema({
    line1: {
      type: String,
      required: function() { return this.address != null; }
    },
    line2: {
      type: String,
      required: false
    },
    city: {
      type: String,
      required: function() { return this.address != null; }
    },
    zipcode: {
      type: String,
      required: function() { return this.address != null; }
    }
  });

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  phoneNumber: {
    type: String,
    required: false
  },
  address: addressSchema
});

userSchema.pre('save', function(next) {
  const user = this;
  if (!user.isModified('password')) {
    return next();
  }
  bcrypt.hash(user.password, 10, (error, hashedPassword) => {
    if (error) {
      return next(error);
    }
    user.password = hashedPassword;
    next();
  });
});

userSchema.methods.comparePassword = function(candidatePassword, callback) {
  bcrypt.compare(candidatePassword, this.password, (error, isMatch) => {
    if (error) {
      return callback(error);
    }
    callback(null, isMatch);
  });
};

const User = mongoose.model('User', userSchema);

module.exports = User;