import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { HomepageSettings } from './apps/api/src/models/HomepageSettings';

dotenv.config({ path: './apps/api/.env' });

const seedFaq = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI as string);
    console.log('Connected to MongoDB');

    let settings = await HomepageSettings.findOne();
    if (!settings) {
      settings = new HomepageSettings();
    }

    settings.faqs = [
      {
        question: "How long does shipping take?",
        answer: "Standard shipping takes 3-5 business days. Expedited shipping is available at checkout for 1-2 day delivery."
      },
      {
        question: "What is your return policy?",
        answer: "We offer a 30-day money-back guarantee for all unused items in their original packaging. Please contact support to initiate a return."
      },
      {
        question: "Are these products authentic?",
        answer: "Yes! All products sold on TechVerse are 100% authentic and come with standard manufacturer warranties."
      },
      {
        question: "How can I track my order?",
        answer: "Once your order is shipped, you will receive an email with a tracking link. You can also track it from your dashboard."
      }
    ];

    await settings.save();
    console.log('FAQs successfully seeded into HomepageSettings!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding FAQs:', error);
    process.exit(1);
  }
};

seedFaq();
