
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Admin = require('./models/admin');
const Category = require('./models/category');
const Product = require('./models/product');
const Banner = require('./models/banner');
const Content = require('./models/content');

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB Connected...');
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

const importData = async () => {
  await connectDB();
  try {
    await Admin.deleteMany();
    await Category.deleteMany();
    await Product.deleteMany();
    await Banner.deleteMany();
    await Content.deleteMany();

    const adminUser = new Admin({
      username: 'admin',
      email: 'admin@example.com',
      password: 'password',
    });

    await adminUser.save();

    console.log('Data Imported!');
    process.exit();
  } catch (err) {
    console.error(`${err}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  await connectDB();
  try {
    await Admin.deleteMany();
    await Category.deleteMany();
    await Product.deleteMany();
    await Banner.deleteMany();
    await Content.deleteMany();

    console.log('Data Destroyed!');
    process.exit();
  } catch (err) {
    console.error(`${err}`);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}
