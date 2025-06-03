import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create categories
  const appetizers = await prisma.category.create({
    data: {
      name: 'Appetizers',
      description: 'Start your meal with our delicious appetizers',
      sortOrder: 1,
    },
  });

  const mains = await prisma.category.create({
    data: {
      name: 'Main Courses',
      description: 'Hearty and satisfying main dishes',
      sortOrder: 2,
    },
  });

  const desserts = await prisma.category.create({
    data: {
      name: 'Desserts',
      description: 'Sweet treats to end your meal perfectly',
      sortOrder: 3,
    },
  });

  const beverages = await prisma.category.create({
    data: {
      name: 'Beverages',
      description: 'Refreshing drinks to complement your meal',
      sortOrder: 4,
    },
  });

  // Create menu items
  const menuItems = [
    // Appetizers
    {
      name: 'Crispy Calamari',
      description: 'Fresh squid rings served with marinara sauce and lemon',
      price: 12.99,
      categoryId: appetizers.id,
      image: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjS4sQIERgakYMhRl4roa5XNCKj6tcBguYMLTp5DfJ7VdMu2pyawxpgfV-pNfY_29EC2vfG16K4bYVqCJyl-9imQH11MiHPHDVi5SFXmL0fJE3ODie43ERNG4xm8N951I5hcVpzHN_-zmtuAEu0RpOvYGrL5cWlqAwKnySLtJ4zwqhQ1Qtt9Abj2TDe/s1000/N7oMDdCwZF1IEKA.jpg',
    },
    {
      name: 'Buffalo Wings',
      description: 'Spicy chicken wings served with blue cheese dip and celery',
      price: 14.99,
      categoryId: appetizers.id,
      image: 'https://i.pinimg.com/originals/ef/33/50/ef33501913fc629e286106dfcdb2dab0.jpg',
    },
    {
      name: 'Spinach Artichoke Dip',
      description: 'Creamy dip served hot with tortilla chips',
      price: 10.99,
      categoryId: appetizers.id,
      image: 'https://i.pinimg.com/originals/87/24/df/8724dffc9cbb5f06159bfb4b1682c080.jpg',
    },
    {
      name: 'Mozzarella Sticks',
      description: 'Golden fried mozzarella with marinara sauce',
      price: 9.99,
      categoryId: appetizers.id,
      image: 'https://i.ytimg.com/vi/reOPhjEWLZs/maxresdefault.jpg',
    },

    // Main Courses
    {
      name: 'Grilled Salmon',
      description: 'Atlantic salmon with lemon herb butter, served with rice and vegetables',
      price: 24.99,
      categoryId: mains.id,
      image: 'https://www.healthyeatingguru.com/wp-content/uploads/2023/11/Grilled-lemon-herb-salmon.jpg',
    },
    {
      name: 'Ribeye Steak',
      description: '12oz ribeye steak cooked to perfection with garlic mashed potatoes',
      price: 32.99,
      categoryId: mains.id,
      image: 'https://i.pinimg.com/originals/f2/e4/78/f2e4785078fb9de2b1b1ba29fe80848e.png',
    },
    {
      name: 'Chicken Parmesan',
      description: 'Breaded chicken breast with marinara sauce and melted mozzarella',
      price: 19.99,
      categoryId: mains.id,
      image: 'https://i.pinimg.com/originals/61/99/54/6199542a7c4537e05ceaf11a55fde0e0.jpg',
    },
    {
      name: 'Vegetarian Pasta',
      description: 'Penne pasta with seasonal vegetables in a creamy alfredo sauce',
      price: 16.99,
      categoryId: mains.id,
      image: 'https://i.pinimg.com/originals/c6/99/72/c699727030df2c560e5f7694c602d4ac.jpg',
    },
    {
      name: 'Fish and Chips',
      description: 'Beer-battered cod with crispy fries and tartar sauce',
      price: 18.99,
      categoryId: mains.id,
      image: 'https://thestayathomechef.com/wp-content/uploads/2020/03/Beer-Battered-Fish-and-Chips-6.jpg',
    },
    {
      name: 'BBQ Ribs',
      description: 'Slow-cooked baby back ribs with our signature BBQ sauce',
      price: 26.99,
      categoryId: mains.id,
      image: 'https://i.imgur.com/yKjOObr.jpg',
    },

    // Desserts
    {
      name: 'Chocolate Lava Cake',
      description: 'Warm chocolate cake with molten center, served with vanilla ice cream',
      price: 8.99,
      categoryId: desserts.id,
      image: 'https://i.pinimg.com/originals/26/45/2d/26452d554fc319de4cb857fd680bf536.jpg',
    },
    {
      name: 'Tiramisu',
      description: 'Classic Italian dessert with coffee-soaked ladyfingers and mascarpone',
      price: 7.99,
      categoryId: desserts.id,
      image: 'https://i.pinimg.com/736x/e8/83/d5/e883d5f944792697147e0523fab98e93--tolkien-lady-fingers.jpg',
    },
    {
      name: 'New York Cheesecake',
      description: 'Rich and creamy cheesecake with berry compote',
      price: 6.99,
      categoryId: desserts.id,
      image: 'https://s-media-cache-ak0.pinimg.com/originals/3c/6f/db/3c6fdb036875b63c94416cc4f9781f81.jpg',
    },
    {
      name: 'Apple Pie',
      description: 'Homemade apple pie with cinnamon and vanilla ice cream',
      price: 6.99,
      categoryId: desserts.id,
      image: 'https://i.pinimg.com/736x/cc/0b/33/cc0b331e2d9a085ea646ae2e7a8b4c9b--homemade-apple-pies-vanilla-ice-cream.jpg',
    },

    // Beverages
    {
      name: 'Fresh Orange Juice',
      description: 'Freshly squeezed orange juice',
      price: 4.99,
      categoryId: beverages.id,
      image: 'https://i.pinimg.com/originals/fe/2f/8a/fe2f8af5277f44ef97cfdd1a19869e9b.jpg',
    },
    {
      name: 'Iced Tea',
      description: 'Refreshing iced tea with lemon',
      price: 3.99,
      categoryId: beverages.id,
      image: 'https://img.freepik.com/premium-photo/glass-iced-tea-with-lemon-slice-top_787273-1630.jpg',
    },
    {
      name: 'Coffee',
      description: 'Freshly brewed coffee',
      price: 2.99,
      categoryId: beverages.id,
      image: 'https://thumbs.dreamstime.com/z/cup-delicious-freshly-brewed-espresso-coffee-served-plain-white-saucer-macaroon-grungy-weathered-36811173.jpg',
    },
    {
      name: 'Soft Drinks',
      description: 'Coca-Cola, Pepsi, Sprite, or other soft drinks',
      price: 2.99,
      categoryId: beverages.id,
      image: 'https://c8.alamy.com/comp/R702XA/glasses-and-bottles-of-assorted-carbonated-soft-drinks-R702XA.jpg',
    },
    {
      name: 'Sparkling Water',
      description: 'Premium sparkling water with lime',
      price: 3.99,
      categoryId: beverages.id,
      image: 'https://walkingonsunshinerecipes.com/wp-content/uploads/2022/07/FEATURED-NEW-SIZE-Sparkling-Lime-Water-1024x1024.jpg',
    },
  ];

  // Insert menu items
  for (const item of menuItems) {
    await prisma.menuItem.create({
      data: item,
    });
  }

  // Create sample tables for the floor plan
  const tables = [
    // Window side tables (2-person)
    { number: 'T1', capacity: 2, x: 50, y: 50, width: 80, height: 80, description: 'Window table for 2' },
    { number: 'T2', capacity: 2, x: 200, y: 50, width: 80, height: 80, description: 'Window table for 2' },
    { number: 'T3', capacity: 2, x: 350, y: 50, width: 80, height: 80, description: 'Window table for 2' },
    { number: 'T4', capacity: 2, x: 500, y: 50, width: 80, height: 80, description: 'Window table for 2' },
    
    // Center area tables (4-person)
    { number: 'T5', capacity: 4, x: 100, y: 200, width: 100, height: 100, description: 'Center table for 4' },
    { number: 'T6', capacity: 4, x: 300, y: 200, width: 100, height: 100, description: 'Center table for 4' },
    { number: 'T7', capacity: 4, x: 500, y: 200, width: 100, height: 100, description: 'Center table for 4' },
    
    // Large tables (6-person)
    { number: 'T8', capacity: 6, x: 150, y: 350, width: 120, height: 100, description: 'Large table for 6' },
    { number: 'T9', capacity: 6, x: 400, y: 350, width: 120, height: 100, description: 'Large table for 6' },
    
    // Corner booth (4-person)
    { number: 'B1', capacity: 4, x: 50, y: 500, width: 150, height: 80, description: 'Corner booth for 4' },
    { number: 'B2', capacity: 4, x: 450, y: 500, width: 150, height: 80, description: 'Corner booth for 4' },
    
    // Bar seating (2-person each)
    { number: 'BR1', capacity: 2, x: 700, y: 100, width: 60, height: 120, description: 'Bar seating' },
    { number: 'BR2', capacity: 2, x: 700, y: 250, width: 60, height: 120, description: 'Bar seating' },
    { number: 'BR3', capacity: 2, x: 700, y: 400, width: 60, height: 120, description: 'Bar seating' },
    
    // VIP table (8-person)
    { number: 'VIP1', capacity: 8, x: 250, y: 500, width: 150, height: 120, description: 'VIP table for 8' },
  ];

  // Insert tables
  for (const table of tables) {
    await prisma.table.create({
      data: table,
    });
  }

  console.log('✅ Database seeded successfully!');
  console.log(`Created ${menuItems.length} menu items across 4 categories`);
  console.log(`Created ${tables.length} tables for the floor plan`);
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
