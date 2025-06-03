import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Types } from 'mongoose';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  async createCategory(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoryService.createCategory(createCategoryDto);
  }

  @Get()
  async getAllCategories() {
    return this.categoryService.getAllCategories();
  }

  @Get(':id')
  async getCategoryById(@Param('id') id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new HttpException('Invalid ID', HttpStatus.BAD_REQUEST);
    }

    const Category = await this.categoryService.getCategoryById(id);
    if (!Category) {
      throw new HttpException('Category Not Found', HttpStatus.NOT_FOUND);
    }

    return Category;
  }

  @Patch(':id')
  async updateCategory(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    console.log(updateCategoryDto);

    if (!Types.ObjectId.isValid(id)) {
      throw new HttpException('Invalid ID', HttpStatus.BAD_REQUEST);
    }

    const updatedCategory = await this.categoryService.updateCategory(
      id,
      updateCategoryDto,
    );
    if (!updatedCategory) {
      throw new HttpException('Category Not Found', HttpStatus.NOT_FOUND);
    }
    return updatedCategory;
  }

  @Delete(':id')
  async deleteCategory(@Param('id') id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new HttpException('Invalid ID', HttpStatus.BAD_REQUEST);
    }

    const deletedCategory = await this.categoryService.deleteCategory(id);
    if (!deletedCategory) {
      throw new HttpException('Category Not Found', HttpStatus.NOT_FOUND);
    }

    return deletedCategory;
  }

  @Get('by-podcast/:podcastId')
  async getCategoriesByPodcast(@Param('podcastId') podcastId: string) {
    return this.categoryService.getCategoriesByPodcast(podcastId);
  }
}
