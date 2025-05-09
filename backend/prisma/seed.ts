import { PrismaClient } from '@prisma/client';

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

  // Insert Token
  // const token = await prisma.token.create({
  //   data: {
  //     type: 'Zoho',
  //     key: 'this-random-key-will-generate-itself',
  //     expiresIn: 1745751793696,
  //   },
  // });

  categories.map(async (category) => {
    await prisma.category.create({
      data: {
        name: category,
      },
    });
  });
}

main()
  .catch((e) => {
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
