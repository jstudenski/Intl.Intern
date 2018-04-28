const mongoose = require('mongoose');
const passport = require('passport');
const passportLocalMongoose = require('passport-local-mongoose');

// const Schema = mongoose.Schema;
const { Schema } = mongoose;

const UserSchema = new Schema({
  // Note: actual password won't be stored, only salted hash of password
  username: {
    type: String,
    trim: true,
    required: 'Username is required',
  },
  email: {
    type: String,
    unique: true,
    match: [/.+@.+\..+/, 'Please enter a valid e-mail address'],
  },
  fullname: {
    type: String,
  },
  userCreated: {
    type: Date,
    default: Date.now,
  },
  homeLocationCity: {
    type: String,
    required: 'Home Location City is Required',
  },
  homeLocationCountry: {
    type: String,
    required: 'Home Location Country is Required',
  },
  homeLocationCountryCode: {
    type: String,
  },
  homeLocationCurrencyCode: {
    type: String,
  },
  internLocationCity: {
    type: String,
    required: 'Internship Location City is Required',
  },
  internLocationCountry: {
    type: String,
    required: 'Internship Location Country is Required',
  },
  internLocationCountryCode: {
    type: String,
  },
  internLocationCurrencyCode: {
    type: String,
  },


  // `chapterRef` is an object that stores a Chapter id
  // The ref property links the ObjectId to the Chapter model
  // This allows us to populate the User with an associated Chapter
  chapterRef: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Chapter',
    },
  ],
  needsRef: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Needs',
    },
  ],
  expRef: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Expense',
    },
  ],
});

const otherPassportOptions = {
  usernameUnique: true,
  passwordValidator: (input, cb) => {
    if (input.length < 6) {
      return cb({ code: 400, messaage: 'Password should be at least 6 characters long.' });
    }
    return cb(null);
  }
};

passport.serializeUser((user, done) => {
  done(null, user);
});
// console.log('user model', UserSchema);

UserSchema.plugin(passportLocalMongoose, otherPassportOptions);
// UserSchema.plugin(passportLocalMongoose);

// UserSchema.methods.toJSON = () => {
//   const obj = this.toObject();
//   delete obj.hash;
//   delete obj.salt;
//   return obj;
// };

// UserSchema.plugin(passportLocalMongoose);

const User = mongoose.model('User', UserSchema);

passport.deserializeUser((user, done) => {
  User.findById(user._id)
    .populate('expRef')
    .populate('needsRef')
    .populate('chapterRef')
    .exec((err, data) => {
      if (err) {
        console.log('Error when deserializes user', err);
      } else {
        done(null, data);
      }
    });
});


module.exports = User;
