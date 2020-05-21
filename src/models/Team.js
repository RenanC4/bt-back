const {Schema, model} = require('mongoose');

const TeamSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  captain: String,
  bio: String,
  members: {
    type: Object,
  },
}, {
  timestamps: true,
});

module.exports = model('Team', TeamSchema);
