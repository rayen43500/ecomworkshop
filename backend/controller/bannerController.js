const Banner = require("../model/bannerModel");
const ErrorHandler = require("../utils/errorHandler");
const asyncWrapper = require("../middleWare/asyncWrapper");
const cloudinary = require("cloudinary");

// Get All Banners (Public)
exports.getAllBanners = asyncWrapper(async (req, res, next) => {
  const banners = await Banner.find();
  res.status(200).json({
    success: true,
    banners,
  });
});

// Create Banner (Admin Only)
exports.createBanner = asyncWrapper(async (req, res, next) => {
  if (!req.body.image) {
    return next(new ErrorHandler("Please upload a banner image", 400));
  }

  const result = await cloudinary.v2.uploader.upload(req.body.image, {
    folder: "Banners",
  });

  const banner = await Banner.create({
    tagline: req.body.tagline,
    quote: req.body.quote,
    saleText: req.body.saleText,
    productText: req.body.productText || "Shop Now",
    image: {
      public_id: result.public_id,
      url: result.secure_url,
    },
  });

  res.status(201).json({
    success: true,
    banner,
  });
});

// Update Banner (Admin Only)
exports.updateBanner = asyncWrapper(async (req, res, next) => {
  let banner = await Banner.findById(req.params.id);

  if (!banner) {
    return next(new ErrorHandler("Banner not found", 404));
  }

  if (req.body.image) {
    await cloudinary.v2.uploader.destroy(banner.image.public_id);
    const result = await cloudinary.v2.uploader.upload(req.body.image, {
      folder: "Banners",
    });
    banner.image = {
      public_id: result.public_id,
      url: result.secure_url,
    };
  }

  if (req.body.tagline !== undefined) banner.tagline = req.body.tagline;
  if (req.body.quote !== undefined) banner.quote = req.body.quote;
  if (req.body.saleText !== undefined) banner.saleText = req.body.saleText;
  if (req.body.productText !== undefined) banner.productText = req.body.productText;

  await banner.save();

  res.status(200).json({
    success: true,
    banner,
  });
});

// Delete Banner (Admin Only)
exports.deleteBanner = asyncWrapper(async (req, res, next) => {
  const banner = await Banner.findById(req.params.id);

  if (!banner) {
    return next(new ErrorHandler("Banner not found", 404));
  }

  // Delete image from Cloudinary
  await cloudinary.v2.uploader.destroy(banner.image.public_id);

  await banner.deleteOne();

  res.status(200).json({
    success: true,
    message: "Banner deleted successfully",
  });
});
