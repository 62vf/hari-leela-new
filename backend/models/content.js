
const mongoose = require('mongoose');

const ContentSchema = new mongoose.Schema({
  key: {
    type: String,
    required: true,
    unique: true,
  },
  value: {
    type: String,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

ContentSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

const Content = mongoose.model('Content', ContentSchema);

module.exports = Content;
