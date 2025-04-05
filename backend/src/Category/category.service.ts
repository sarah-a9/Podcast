import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Category } from 'src/schemas/Category.schema';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoryService {
    constructor(@InjectModel(Category.name) private categoryModel : Model<Category>){}

    async createCategory(createCategoryDto : CreateCategoryDto){
        const newCategory = new this.categoryModel(createCategoryDto);
        const savedCategory = await newCategory.save();
        return savedCategory;
    }

    async getAllCategories(){
        return this.categoryModel.find().populate({
            path:'listePodcasts',
            model:'Podcast',
            select:'podcastName podcastDescription podcastImage'
        }).exec();
    }

    async getCategoryById(id:string){
        return this.categoryModel.findById(id).populate({
            path:'listePodcasts',
            model:'Podcast',
            select:'podcastName podcastDescription podcastImage'
        }).exec();
    }

    async updateCategory(id :string, updateCategoryDto : UpdateCategoryDto){
        const updatedCategory = await this.categoryModel.findByIdAndUpdate(id, updateCategoryDto, { new: true });

        return updatedCategory;
    }


    async deleteCategory(id:string){
        return this.categoryModel.findByIdAndDelete(id);
    }

}

