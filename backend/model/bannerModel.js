const mongoose = require("mongoose");

const bannerSchema = new mongoose.Schema({
  image: {
    public_id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
  tagline: {
    type: String,
    required: [true, "Please Enter tagline"],
    trim: true,
  },
  quote: {
    type: String,
    required: [true, "Please Enter quote"],
    trim: true,
  },
  saleText: {
    type: String,
    required: [true, "Please Enter sale text"],
    trim: true,
  },
  productText: {
    type: String,
    required: [true, "Please Enter button text"],
    default: "Shop Now",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Banner", bannerSchema);
