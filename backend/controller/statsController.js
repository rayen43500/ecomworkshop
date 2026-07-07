const ProductModel = require("../model/ProductModel");
const orderModel = require("../model/orderModel");
const userModel = require("../model/userModel");
const asyncWrapper = require("../middleWare/asyncWrapper");

exports.getAdminStats = asyncWrapper(async (req, res) => {
  const [productStats, orderStats, userCount] = await Promise.all([
    ProductModel.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          outOfStock: {
            $sum: { $cond: [{ $eq: ["$Stock", 0] }, 1, 0] },
          },
        },
      },
    ]),
    orderModel.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          totalAmount: { $sum: "$totalPrice" },
        },
      },
    ]),
    userModel.countDocuments(),
  ]);

  const products = productStats[0] || { total: 0, outOfStock: 0 };
  const orders = orderStats[0] || { total: 0, totalAmount: 0 };

  res.status(200).json({
    success: true,
    stats: {
      productsCount: products.total,
      outOfStock: products.outOfStock,
      inStock: products.total - products.outOfStock,
      ordersCount: orders.total,
      totalRevenue: orders.totalAmount || 0,
      usersCount: userCount,
    },
  });
});
