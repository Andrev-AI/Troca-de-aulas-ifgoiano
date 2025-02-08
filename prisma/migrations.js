const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    // Criar tabelas iniciais
    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS "Subject" (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) UNIQUE NOT NULL
      );
    `;

    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS "Teacher" (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL
      );
    `;

    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS "_TeacherSubjects" (
        "A" INTEGER NOT NULL,
        "B" INTEGER NOT NULL,
        FOREIGN KEY ("A") REFERENCES "Teacher"(id) ON DELETE CASCADE,
        FOREIGN KEY ("B") REFERENCES "Subject"(id) ON DELETE CASCADE,
        UNIQUE("A", "B")
      );
    `;

    console.log('Migrations completed successfully');
  } catch (error) {
    console.error('Error running migrations:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();