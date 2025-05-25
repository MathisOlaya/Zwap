import { Injectable } from '@nestjs/common';
import { Category } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CategoryService {
  constructor(private readonly prisma: PrismaService) {}

  async getCategoriesInfo(categoriesID: Array<any>): Promise<Array<Category>> {
    const categories = await Promise.all(
      categoriesID.map(async (categoryID) => {
        return await this.prisma.category.findFirstOrThrow({
          where: { id: categoryID.categoryId },
        });
      }),
    );

    return categories;
  }
}
