const {Schema, model} = require('mongoose');
const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  summonerId: {
    type: String,
    required: true,
  },
  accountId: {
    type: String,
    required: true,
  },
  level: {
    type: String,
    required: true,
  },
  bio: String,
  status: {
    type: String,
    required: true,
  },
  tags: {
    type: Array,
    required: false,
  },
  rank: {
    type: Array,
    required: true,
  },
  friends: {
    type: Array,
    required: false,
  },
  teams: {
    type: Array,
    required: false,
  },
}, {
  timestamps: true,
});

module.exports = model('User', UserSchema);
