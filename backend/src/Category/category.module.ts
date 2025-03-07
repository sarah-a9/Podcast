import { Module } from '@nestjs/common';
import { CategoryController } from '../Category/category.controller'
import { CategoryService } from '../Category/category.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Category, CategorySchema } from '../schemas/Category.schema'
@Module({
  imports : [
    MongooseModule.forFeature([
      {name : Category.name , schema :CategorySchema}
    ])
  ],
  controllers: [CategoryController],
  providers: [CategoryService]
})
export class CategoryModule {}
