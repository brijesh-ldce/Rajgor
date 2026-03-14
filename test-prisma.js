const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

const prisma = new PrismaClient({ log: ['query', 'info', 'warn', 'error'] });

async function main() {
  try {
    console.log("Testing connection...");
    // Just try to find a user
    const user = await prisma.user.findUnique({ where: { email: "test@example.com" } });
    console.log("Success! Found user:", user ? "yes" : "no");
  } catch (e) {
    console.error("Error connecting:");
    console.error(e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
