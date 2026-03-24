import { PrismaClient } from '@prisma/client';
import { randomUUID } from 'crypto';

const prisma = new PrismaClient();

const categories = ['Electronics', 'Clothing', 'Home', 'Sports', 'Books'];

const products: Record<string, string[]> = {
  Electronics: ['Laptop', 'Smartphone', 'Tablet', 'Headphones', 'Smart Watch'],
  Clothing: ['T-Shirt', 'Jeans', 'Jacket', 'Sneakers', 'Hat'],
  Home: ['Lamp', 'Chair', 'Table', 'Sofa', 'Rug'],
  Sports: ['Basketball', 'Tennis Racket', 'Yoga Mat', 'Dumbbells', 'Running Shoes'],
  Books: ['Fiction', 'Non-Fiction', 'Science', 'History', 'Biography'],
};

const prices: Record<string, number> = {
  Laptop: 999.99,
  Smartphone: 699.99,
  Tablet: 449.99,
  Headphones: 149.99,
  'Smart Watch': 299.99,
  'T-Shirt': 29.99,
  Jeans: 59.99,
  Jacket: 89.99,
  Sneakers: 79.99,
  Hat: 24.99,
  Lamp: 49.99,
  Chair: 149.99,
  Table: 249.99,
  Sofa: 599.99,
  Rug: 129.99,
  Basketball: 29.99,
  'Tennis Racket': 89.99,
  'Yoga Mat': 34.99,
  Dumbbells: 49.99,
  'Running Shoes': 119.99,
  Fiction: 14.99,
  'Non-Fiction': 19.99,
  Science: 24.99,
  History: 22.99,
  Biography: 18.99,
};

async function seed() {
  console.log('Seeding database...');

  // Clear existing data
  await prisma.sale.deleteMany();
  await prisma.user.deleteMany();

  // Create users
  const users = await Promise.all([
    prisma.user.create({ data: { name: 'John Doe', email: 'john@example.com' } }),
    prisma.user.create({ data: { name: 'Jane Smith', email: 'jane@example.com' } }),
    prisma.user.create({ data: { name: 'Bob Wilson', email: 'bob@example.com' } }),
  ]);

  console.log(`Created ${users.length} users`);

  // Create sales data for the past 12 months
  const salesData = [];
  const now = new Date();
  const twelveMonthsAgo = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());

  const productIds = Array.from({ length: 100 }, () => randomUUID());
  let productIndex = 0;
  for (let i = 0; i < 500; i++) {
    const category = categories[Math.floor(Math.random() * categories.length)];
    const categoryProducts = products[category];
    const product = categoryProducts[Math.floor(Math.random() * categoryProducts.length)];

    // Generate random date within the past 12 months
    const randomDate = new Date(
      twelveMonthsAgo.getTime() + Math.random() * (now.getTime() - twelveMonthsAgo.getTime())
    );

    const quantity = Math.floor(Math.random() * 5) + 1;
    const price = prices[product] || Math.random() * 100 + 10;
    const amount = price * quantity;

    salesData.push({
      productId: productIds[productIndex++],
      product,
      category,
      amount,
      quantity,
      createdAt: randomDate,
    });

    if (productIndex >= 100) productIndex = 0;
  }

  // Create sales in batches
  const batchSize = 100;
  for (let i = 0; i < salesData.length; i += batchSize) {
    const batch = salesData.slice(i, i + batchSize);
    await prisma.sale.createMany({ data: batch });
  }

  console.log(`Created ${salesData.length} sales`);
  console.log('Seeding completed!');
}

seed()
  .catch((e) => {
    console.error('Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
