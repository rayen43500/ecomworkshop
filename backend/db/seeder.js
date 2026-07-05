const path = require("path");
const fs = require("fs");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

// Load Environment Variables
const primaryEnvPath = path.join(__dirname, "..", "config", "config.env");
const fallbackEnvPath = path.join(__dirname, "..", "config", "config.env.example");
const envPath = fs.existsSync(primaryEnvPath) ? primaryEnvPath : fallbackEnvPath;

dotenv.config({ path: envPath });

const userModel = require("../model/userModel");
const ProductModel = require("../model/ProductModel");

const seedData = async () => {
  try {
    const mongoURI = process.env.MONGO_URI || process.env.DB_LINK;
    if (!mongoURI) {
      console.error("❌ Database connection string not found in environment variables");
      process.exit(1);
    }

    console.log("Connecting to Database...");
    await mongoose.connect(mongoURI);
    console.log("✅ Database connected successfully!");

    // Clean up collections
    console.log("Cleaning database collections...");
    await userModel.deleteMany({});
    await ProductModel.deleteMany({});
    console.log("✅ Cleaned users and products collections!");

    // Create Test Users
    console.log("Creating admin and user accounts...");
    
    const adminUser = await userModel.create({
      name: "Admin User",
      email: "admin@gmail.com",
      password: "password123",
      role: "admin",
      avatar: {
        public_id: "Avatar/default_admin",
        url: "https://res.cloudinary.com/demo/image/upload/v1372223293/sample.jpg"
      }
    });

    const regularUser = await userModel.create({
      name: "Normal User",
      email: "user@gmail.com",
      password: "password123",
      role: "user",
      avatar: {
        public_id: "Avatar/default_user",
        url: "https://res.cloudinary.com/demo/image/upload/v1372223293/sample.jpg"
      }
    });

    console.log("✅ Admin and user accounts created successfully!");
    console.log(`   - Admin: admin@gmail.com / password123`);
    console.log(`   - User:  user@gmail.com / password123`);

    // Create Sample Products
    console.log("Creating sample products...");

    const sampleProducts = [
      {
        name: "SG Savage Edition English Willow Bat",
        description: "Premium English willow bat with excellent balance, light pickup, and big edges designed for professional play.",
        price: 15500,
        info: "Short handle, natural finish, includes padded bat cover, premium grip.",
        ratings: 4.8,
        category: "Bats",
        Stock: 12,
        images: [
          {
            product_id: "Products/bat_savage",
            url: "https://res.cloudinary.com/demo/image/upload/v1372223293/sample.jpg"
          }
        ],
        user: adminUser._id
      },
      {
        name: "SS Ton Super Cricket Ball (Box of 6)",
        description: "Alum tanned leather balls, hand-stitched with premium cork core for excellent bounce and shape retention.",
        price: 3200,
        info: "Four-piece construction, waterproof coating, red color.",
        ratings: 4.5,
        category: "Balls",
        Stock: 25,
        images: [
          {
            product_id: "Products/ball_ton",
            url: "https://res.cloudinary.com/demo/image/upload/v1372223293/sample.jpg"
          }
        ],
        user: adminUser._id
      },
      {
        name: "Kookaburra Beast Batting Gloves",
        description: "Professional grade batting gloves with high-density foam padding and Pittards leather palm for exceptional grip.",
        price: 2800,
        info: "Available in Adult size, lightweight, maximum ventilation.",
        ratings: 4.6,
        category: "Batting Gloves",
        Stock: 15,
        images: [
          {
            product_id: "Products/gloves_beast",
            url: "https://res.cloudinary.com/demo/image/upload/v1372223293/sample.jpg"
          }
        ],
        user: adminUser._id
      },
      {
        name: "Gray-Nicolls Legend Batting Pads",
        description: "Top-of-the-line leg guards offering maximum protection with gel inserts and fiberglass reinforced knee cups.",
        price: 6500,
        info: "Moulded knee cup, ultra-light foam straps, dynamic fit.",
        ratings: 4.7,
        category: "Batting Pads",
        Stock: 8,
        images: [
          {
            product_id: "Products/pads_legend",
            url: "https://res.cloudinary.com/demo/image/upload/v1372223293/sample.jpg"
          }
        ],
        user: adminUser._id
      },
      {
        name: "Masuri OS2 Pro Helmet",
        description: "Safety-first cricket helmet with steel visor and patented Eye-line grille for maximum facial safety.",
        price: 8500,
        info: "Navy blue color, certified safety standards, adjustable fit.",
        ratings: 4.9,
        category: "Helmets",
        Stock: 10,
        images: [
          {
            product_id: "Products/helmet_masuri",
            url: "https://res.cloudinary.com/demo/image/upload/v1372223293/sample.jpg"
          }
        ],
        user: adminUser._id
      },
      {
        name: "DSC Intense Pro Duffle Bag",
        description: "Spacious duffle bag designed with high-durability fabrics, dedicated bat sleeves, and footwear compartment.",
        price: 4500,
        info: "Capacity 90L, padded shoulder straps, heavy duty zippers.",
        ratings: 4.4,
        category: "Bags",
        Stock: 14,
        images: [
          {
            product_id: "Products/bag_dsc",
            url: "https://res.cloudinary.com/demo/image/upload/v1372223293/sample.jpg"
          }
        ],
        user: adminUser._id
      }
    ];

    await ProductModel.insertMany(sampleProducts);
    console.log("✅ Sample products seeded successfully!");

    console.log("🎉 Database seeding completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding failed with error:", error.message);
    console.error(error.stack);
    process.exit(1);
  }
};

seedData();
