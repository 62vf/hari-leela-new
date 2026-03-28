
const mongoose = require('mongoose');

const BannerSchema = new mongoose.Schema({
  title: {
    type: String,
  },
  subtitle: {
    type: String,
  },
  image: {
    type: String,
    required: true,
  },
  link: {
    type: String,
  },
  buttonText: {
    type: String,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  sortOrder: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

BannerSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

const Banner = mongoose.model('Banner', BannerSchema);

module.exports = Banner;
