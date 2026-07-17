import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User } from './src/models/User';

dotenv.config({ path: './.env' });

const check = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI as string);
    const users = await User.find({ email: 'admin@techverse.com' });
    console.log('Users found:', users);
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

check();
