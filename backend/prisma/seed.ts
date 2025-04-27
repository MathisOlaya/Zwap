import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Insert Token
  const token = await prisma.token.create({
    data: {
      type: 'Zoho',
      key: 'this-random-key-will-generate-itself',
      expiresIn: 1745751793696,
    },
  });
}

main()
  .catch((e) => {
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
