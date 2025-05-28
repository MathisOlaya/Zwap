import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';
import * as bcrypt from 'bcrypt';

// Helpers
import { calcPopularityScore } from '../src/article/helpers/article.helper';

const prisma = new PrismaClient();

async function main() {
  const categories = [
    'T-shirts',
    'Chemises',
    'Pulls & Sweats',
    'Vestes & Manteaux',
    'Pantalons',
    'Shorts',
    'Jeans',
    'Costumes',
    'Jogging & Survêtements',
    'Robes',
    'Jupes',
    'Blouses',
    'Bodys',
    'Combinaisons',
    'Baskets',
    'Bottes & Bottines',
    'Sandales & Tongs',
    'Mocassins & Derbies',
    'Talons',
    'Chaussures de sport',
    'Chaussures habillées',
    'Casquettes & Bonnets',
    'Écharpes & Foulards',
    'Ceintures',
    'Sacs à main',
    'Sacs à dos',
    'Montres',
    'Lunettes de soleil',
    'Bijoux',
    'Sous-vêtements homme / femme',
    'Chaussettes',
    'Maillots de bain',
    'Tenues de sport',
    'Accessoires sportifs',
    'Vêtements bébé',
    'Chaussures enfants',
    'Pyjamas enfants',
    'Ensembles',
    'Pyjamas',
    'Loungewear / Homewear',
    'Déguisements',
  ];

  // console.log('Here');
  // Insert Token
  const token = await prisma.token.create({
    data: {
      type: 'Zoho',
      key: 'this-random-key-will-generate-itself',
      expiresIn: 1745751793696,
    },
  });

  const importedCategories = await categories.map(async (category) => {
    return await prisma.category.create({
      data: {
        name: category,
        coverUrl: 'fake url',
      },
    });
  });

  const pwd = await bcrypt.hash('root', 10);
  const user = await prisma.user.create({
    data: {
      firstname: 'Root',
      name: 'Root',
      email: 'mathisolaya@gmail.com',
      password: pwd,
      phoneNumber: '0795507417',
    },
  });

  // Article
  for (let i = 0; i < 100; i++) {
    const click = faker.number.int({ min: 40, max: 80 });
    const likes = faker.number.int({ min: 5, max: 35 });

    const popularity = calcPopularityScore(click, likes);

    const cID = (
      await importedCategories[
        faker.number.int({ min: 0, max: categories.length - 1 })
      ]
    ).id;
    const uID = user.id;

    // Create
    await prisma.article.create({
      data: {
        name: faker.lorem.word(),
        description: faker.lorem.sentences(3),
        price: faker.number.float({ min: 5, max: 130 }),
        clickCount: click,
        likeCount: likes,
        popularityScore: popularity,
        coverImg: faker.image.url(),
        userId: uID,
        categoryId: cID,
      },
    });
  }
}

main()
  .catch((e) => {
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
