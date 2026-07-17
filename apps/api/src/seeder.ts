import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User } from './models/User';
import { Product } from './models/Product';
import { Category } from './models/Category';
import { Brand } from './models/Brand';
import { Order } from './models/Order';
import { Vendor } from './models/Vendor';
import { Enquiry } from './models/Enquiry';
import { Review } from './models/Review';
import { Wishlist } from './models/Wishlist';
import { QA } from './models/QA';
import bcrypt from 'bcryptjs';

dotenv.config();

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI as string);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error: any) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

const importData = async () => {
  try {
    await connectDB();

    await User.deleteMany();
    await Product.deleteMany();
    await Category.deleteMany();
    await Brand.deleteMany();
    await Vendor.deleteMany();
    await Order.deleteMany();
    await Enquiry.deleteMany();

    console.log('Data Destroyed!');

    // 1. Users (1 Super Admin, 1 Admin, 3 Vendors, 10 Customers)
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);
    
    const usersData = [
      { name: 'Super Admin', email: 'superadmin@techverse.com', password: hashedPassword, role: 'superadmin' },
      { name: 'Admin', email: 'admin@techverse.com', password: hashedPassword, role: 'admin' },
      { name: 'Vendor 1', email: 'vendor1@techverse.com', password: hashedPassword, role: 'vendor' },
      { name: 'Vendor 2', email: 'vendor2@techverse.com', password: hashedPassword, role: 'vendor' },
      { name: 'Vendor 3', email: 'vendor3@techverse.com', password: hashedPassword, role: 'vendor' },
    ];
    for (let i = 1; i <= 10; i++) {
      usersData.push({ name: `Customer ${i}`, email: `customer${i}@techverse.com`, password: hashedPassword, role: 'customer' });
    }
    const createdUsers = await User.insertMany(usersData);
    
    const vendorUsers = createdUsers.filter(u => u.role === 'vendor');
    const customers = createdUsers.filter(u => u.role === 'customer');

    // Create Vendor Profiles
    const vendorsData = vendorUsers.map((u, i) => ({
      user: u._id,
      storeName: `Vendor Store ${i + 1}`,
      storeDescription: 'Premium electronics and gadgets.',
      businessAddress: {
        street: '123 Market St',
        city: 'Jodhpur',
        state: 'Rajasthan',
        country: 'India',
        zipCode: '342001'
      },
      contactEmail: u.email,
      contactPhone: '1234567890',
      status: 'approved'
    }));
    const vendors = await Vendor.insertMany(vendorsData);

    // 2. Categories (at least 5)
    const categoriesData = [
      { name: 'Mobiles', slug: 'mobiles', description: 'Latest smartphones' },
      { name: 'Laptops', slug: 'laptops', description: 'High performance laptops' },
      { name: 'Headphones', slug: 'headphones', description: 'Audio and music' },
      { name: 'Chargers', slug: 'chargers', description: 'Power adapters and cables' },
      { name: 'Smart Devices', slug: 'smart-devices', description: 'Wearables and IoT' },
      { name: 'Gaming Accessories', slug: 'gaming-accessories', description: 'Controllers and gear' },
      { name: 'Office Gadgets', slug: 'office-gadgets', description: 'Desk setup and productivity' },
    ];
    const createdCategories = await Category.insertMany(categoriesData);

    // 3. Brands
    const createdBrand = await Brand.insertMany([
      { name: 'Apple', slug: 'apple', description: 'Apple Inc' },
      { name: 'Samsung', slug: 'samsung', description: 'Samsung Electronics' },
      { name: 'Sony', slug: 'sony', description: 'Sony Group' },
      { name: 'Logitech', slug: 'logitech', description: 'Logitech International' },
      { name: 'Anker', slug: 'anker', description: 'Anker Innovations' },
    ]);

    // 4. Products (30)
    const productNames = [
      'iPhone 15 Pro Max', 'Samsung Galaxy S24 Ultra', 'Google Pixel 8 Pro', 'OnePlus 12',
      'MacBook Pro M3', 'Dell XPS 15', 'Lenovo ThinkPad X1', 'ASUS ROG Zephyrus',
      'Sony WH-1000XM5', 'AirPods Pro 2', 'Bose QuietComfort Ultra', 'Sennheiser Momentum 4',
      'Anker 737 Power Bank', 'Apple 20W USB-C', 'Samsung 45W Charger', 'Belkin MagSafe Stand',
      'Apple Watch Series 9', 'Samsung Galaxy Watch 6', 'Oura Ring Gen3', 'Amazon Echo Dot',
      'DualSense Wireless Controller', 'Xbox Elite Series 2', 'Razer DeathAdder V3', 'Corsair K70 RGB',
      'Logitech MX Master 3S', 'Keychron Q1 Pro', 'Elgato Stream Deck', 'BenQ ScreenBar',
      'iPad Pro M4', 'Sony PlayStation 5'
    ];
    
    const images = [
      'https://images.unsplash.com/photo-1695048133142-1a20484d2569?q=80&w=800',
      'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?q=80&w=800',
      'https://images.unsplash.com/photo-1598327105666-5b89351aff97?q=80&w=800',
      'https://images.unsplash.com/photo-1621330396173-e41b1cafd17f?q=80&w=800',
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=800',
      'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?q=80&w=800',
      'https://images.unsplash.com/photo-1603302576837-37561b2e2302?q=80&w=800',
      'https://images.unsplash.com/photo-1600861194942-f883de0dfe96?q=80&w=800',
      'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?q=80&w=800',
      'https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?q=80&w=800',
      'https://images.unsplash.com/photo-1546435770-a3e426bf472b?q=80&w=800',
      'https://images.unsplash.com/photo-1583394838336-acd977736f90?q=80&w=800',
      'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?q=80&w=800',
      'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?q=80&w=800',
      'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?q=80&w=800',
      'https://images.unsplash.com/photo-1625750435133-c155513ab028?q=80&w=800',
      'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?q=80&w=800',
      'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?q=80&w=800',
      'https://images.unsplash.com/photo-1599813959325-07ee4b77f884?q=80&w=800',
      'https://images.unsplash.com/photo-1543512214-318c7553f230?q=80&w=800',
      'https://images.unsplash.com/photo-1606144042738-f9b8c049de3c?q=80&w=800',
      'https://images.unsplash.com/photo-1600080972464-8e5f35f63d08?q=80&w=800',
      'https://images.unsplash.com/photo-1527814050087-379381547962?q=80&w=800',
      'https://images.unsplash.com/photo-1595225476474-87563907a212?q=80&w=800',
      'https://images.unsplash.com/photo-1527814050087-379381547962?q=80&w=800',
      'https://images.unsplash.com/photo-1595225476474-87563907a212?q=80&w=800',
      'https://images.unsplash.com/photo-1616423640778-28d1b53229bd?q=80&w=800',
      'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?q=80&w=800',
      'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?q=80&w=800',
      'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?q=80&w=800'
    ];

    const productsData = [];
    for (let i = 0; i < 30; i++) {
      const catIndex = i < 4 ? 0 : i < 8 ? 1 : i < 12 ? 2 : i < 16 ? 3 : i < 20 ? 4 : i < 24 ? 5 : i < 28 ? 6 : 0;
      productsData.push({
        name: productNames[i],
        slug: productNames[i].toLowerCase().replace(/\s+/g, '-'),
        sku: `SKU-${1000 + i}`,
        description: `Premium quality ${productNames[i]} with amazing features, sleek design, and a long-lasting warranty. Perfect for your tech setup.`,
        price: Math.floor(Math.random() * 800 * 80) + (99 * 80),
        salePrice: i % 3 === 0 ? Math.floor(Math.random() * 400 * 80) + (49 * 80) : undefined,
        category: createdCategories[catIndex]._id,
        brand: createdBrand[i % createdBrand.length]._id,
        stock: Math.floor(Math.random() * 100) + 10,
        status: 'published',
        thumbnail: images[i],
        vendor: vendors[i % vendors.length]._id
      });
    }
    const createdProducts = await Product.insertMany(productsData);

    // 5. Orders (15 total)
    const ordersData = [];
    for (let i = 0; i < 15; i++) {
      const customer = customers[i % customers.length];
      const product1 = createdProducts[Math.floor(Math.random() * createdProducts.length)];
      const product2 = createdProducts[Math.floor(Math.random() * createdProducts.length)];
      
      const p1Price = product1.salePrice || product1.price;
      const p2Price = product2.salePrice || product2.price;
      const itemsPrice = p1Price + (p2Price * 2);
      
      ordersData.push({
        user: customer._id,
        orderItems: [
          {
            product: product1._id,
            vendor: product1.vendor,
            name: product1.name,
            qty: 1,
            price: p1Price,
            image: product1.thumbnail
          },
          {
            product: product2._id,
            vendor: product2.vendor,
            name: product2.name,
            qty: 2,
            price: p2Price,
            image: product2.thumbnail
          }
        ],
        shippingAddress: {
          fullName: customer.name,
          street: '123 Tech Street',
          city: 'Jodhpur',
          state: 'Rajasthan',
          country: 'India',
          zipCode: '342001',
          phone: '1234567890'
        },
        paymentMethod: 'Credit Card (Demo)',
        itemsPrice: itemsPrice,
        taxPrice: Number((itemsPrice * 0.15).toFixed(2)),
        shippingPrice: 0,
        totalPrice: Number((itemsPrice * 1.15).toFixed(2)),
        isPaid: true,
        paidAt: new Date(),
        status: i % 2 === 0 ? 'delivered' : 'shipped',
        deliveredAt: i % 2 === 0 ? new Date() : undefined
      });
    }
    await Order.insertMany(ordersData);

    // 6. Enquiries (15 total)
    const enquiriesData = [];
    for (let i = 0; i < 15; i++) {
      const customer = customers[i % customers.length];
      const product = createdProducts[Math.floor(Math.random() * createdProducts.length)];
      
      enquiriesData.push({
        user: customer._id,
        product: product._id,
        vendor: product.vendor,
        quantity: Math.floor(Math.random() * 50) + 10,
        message: `Hi, I am interested in bulk purchasing ${product.name}. What is the best price you can offer?`,
        status: i % 3 === 0 ? 'replied' : 'new',
        reply: i % 3 === 0 ? `We can offer a 10% discount for this quantity.` : undefined,
        quotedPrice: i % 3 === 0 ? (product.salePrice || product.price) * 0.9 : undefined
      });
    }
    await Enquiry.insertMany(enquiriesData);

    // 7. Reviews (20 total)
    const reviewsData = [];
    for (let i = 0; i < 20; i++) {
      const customer = customers[i % customers.length];
      const product = createdProducts[Math.floor(Math.random() * createdProducts.length)];
      
      reviewsData.push({
        user: customer._id,
        product: product._id,
        vendor: product.vendor,
        rating: Math.floor(Math.random() * 2) + 4, // 4 or 5 stars
        comment: `Excellent product! Very satisfied with the quality and delivery.`,
        isVerifiedPurchase: true
      });
    }
    await Review.insertMany(reviewsData);

    // 8. QA (10 total)
    const qaData = [];
    for (let i = 0; i < 10; i++) {
      const customer = customers[i % customers.length];
      const product = createdProducts[Math.floor(Math.random() * createdProducts.length)];
      
      qaData.push({
        product: product._id,
        user: customer._id,
        question: `Does this product come with a warranty?`,
        answer: i % 2 === 0 ? `Yes, it comes with a 1-year standard warranty.` : undefined
      });
    }
    await QA.insertMany(qaData);

    // 9. Wishlist (1 per customer)
    const wishlistsData = customers.map(customer => ({
      user: customer._id,
      products: [
        createdProducts[Math.floor(Math.random() * createdProducts.length)]._id,
        createdProducts[Math.floor(Math.random() * createdProducts.length)]._id
      ]
    }));
    await Wishlist.insertMany(wishlistsData);

    console.log('Data Imported!');
    process.exit();
  } catch (error) {
    console.error(`${error}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await connectDB();

    await User.deleteMany();
    await Product.deleteMany();
    await Category.deleteMany();
    await Brand.deleteMany();
    await Order.deleteMany();
    await Enquiry.deleteMany();
    await Review.deleteMany();
    await QA.deleteMany();
    await Wishlist.deleteMany();

    console.log('Data Destroyed!');
    process.exit();
  } catch (error) {
    console.error(`${error}`);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}
