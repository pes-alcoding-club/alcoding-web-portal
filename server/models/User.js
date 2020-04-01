const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  usn: {
    type: String,
    default: "",
    required: true
  },
  password: {
    type: String,
    // required: true,
    default: ""
  },
  name: {
    firstName: {
      type: String,
      default: "",
      required: true
    },
    lastName: {
      type: String,
      default: ""
    }
  },
  groups: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Group'
  }],
  basicInfo: {
    // Contains mutable info
    email: {
      type: String,
      default: ""
    },
    phone: {
      type: String,
      default: ""
    },
    dob: {
      type: Date,
      default: Date.now()
    }
  },
  contender: {
    // Contains mutable info
    rating: {
      type: Number,
      default: -1
    },
    volatility: {
      type: Number,
      default: -1
    },
    timesPlayed: {
      type: Number,
      default: -1
    },
    lastFive: {
      type: Number,
      default: -1
    },
    best: {
      type: Number,
      default: -1
    },
    handles: {
      codechef: {
        type: String,
        default: ""
      },
      codejam: {
        type: String,
        default: ""
      },
      kickstart: {
        type: String,
        default: ""
      },
      spoj: {
        type: String,
        default: ""
      },
      hackerRank: {
        type: String,
        default: ""
      },
      codeforces: {
        type: String,
        default: ""
      },
      hackerEarth: {
        type: String,
        default: ""
      }
    }
  },
  role: {
    type: String,
    default: "student"
  },
  files: [mongoose.Schema.Types.ObjectId],
  isDeleted: {
    type: Boolean,
    default: false
  }
}, { strict: false, timestamps: true });

// const saltRounds = 10;
// UserSchema.methods = {
//   generateHash: function generateHash(plainTextPassword) {
//     var generatedHash = "";
//     bcrypt.hash(plainTextPassword, saltRounds).then(function (hash) {
//       generatedHash = hash;
//     });
//     console.log(plainTextPassword + "-->" + generatedHash);
//     return generatedHash;
//   },
//   checkPassword: function (plainTextPassword) {
//     return bcrypt.compare(plainTextPassword, this.password).then(function (res) {
//       return res;
//     });
//   }
// };

// module.exports = mongoose.model('User', UserSchema);

const saltRounds = 10;
UserSchema.methods.generateHash = function (password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(saltRounds), null);
};

UserSchema.methods.checkPassword = function (plainTextPassword) {
  return bcrypt.compareSync(plainTextPassword, this.password);
}

module.exports = mongoose.model('User', UserSchema);
