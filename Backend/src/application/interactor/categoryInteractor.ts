import IsubCategoryInteractory from "../../interface/categoryInterface/IcategoryInteractor";
import { responseHandler } from "../../types/commonTypes";
import ICategoryRepo from "../../interface/categoryInterface/IcategoryRepo"; // Import your category repository interface
import {categoryCreationDTo,categoryDTo} from '../../domain/dtos/CategoryDTO'
import mongoose from "mongoose";
import { LargeDataFetch } from '../../types/commonTypes';
import ICategory from "../../domain/entities/categorySchema";
import { ICloudinaryService } from "../../interface/serviceInterface/IcloudinaryInterface";



export class CategoryInteractor implements IsubCategoryInteractory {
  private categoryRepo: ICategoryRepo; // Use the category repository
  private cloudinaryService:ICloudinaryService

  constructor(categoryRepo: ICategoryRepo,cloudinaryService: ICloudinaryService) {
    this.categoryRepo = categoryRepo;
    this.cloudinaryService = cloudinaryService;
  }

  // Add a new category
  async addCategory(data: categoryCreationDTo): Promise<categoryDTo |responseHandler> {
    // console.log("data",data)
    const{name}=data
    const isAvailable=await this.categoryRepo.findByName(name)
    if(isAvailable)
    {
      return { message: "Category always in your bucket", status: 409 };

    }
    if(data && data.photo)
    {
      const uploadImage=await this.cloudinaryService.uploadCategoryImage(data.photo)
      data.photo=uploadImage.secure_url

    }
    const category = await this.categoryRepo.addCategory(data); // Use repository method

    return this.mapToDTO(category);
  }

  // Get all categories
  async getAllCategories(page:number,limit:number): Promise<LargeDataFetch> {
    const categoriesResponse = await this.categoryRepo.getAllCategories(page,limit); // Use repository method
     const categories=categoriesResponse.data.map(this.mapToDTO);
    return {data:categories,totalPages:categoriesResponse.totalPages}
  }
  async getByName(page:number,limit:number,name:string): Promise<LargeDataFetch> {
    const categoriesResponse = await this.categoryRepo.findbyNameSpellings(page,limit,name); // Use repository method
     const categories=categoriesResponse.data.map(this.mapToDTO);
    return {data:categories,totalPages:categoriesResponse.totalPages}
  }

  // Get all listed categories
  async getListedCategories(page: number, limit: number): Promise<LargeDataFetch> {
    try {
      const categoriesResponse = await this.categoryRepo.getListedCategories(page, limit);
      const categories = categoriesResponse.data.map(this.mapToDTO);
      return { data: categories, totalPages: categoriesResponse.totalPages };
    } catch (error) {
      console.error('Error fetching listed categories:', error);
      throw new Error('Failed to fetch listed categories');
    }
  }

  // Get a category by ID
  async getCategoryById(id: mongoose.Types.ObjectId): Promise<categoryDTo | null> {
    const category = await this.categoryRepo.getCategoryById(id); // Use repository method
    return category && !category.isDeleted ? this.mapToDTO(category) : null;
  }

  // Update a category
  async updateCategory(id: mongoose.Types.ObjectId, data: Partial<categoryCreationDTo>): Promise<categoryDTo | responseHandler | null> {
    const {name,photo}=data
    if(name)
    {
      const isAvailable=await this.categoryRepo.findByNameNotId(id,name)
      if(isAvailable)
      {
        return { message: "Category always in your bucket", status: 409 };
  
      }

    }
    if(photo)
      {
        const uploadImage=await this.cloudinaryService.uploadCategoryImage(photo)
        data.photo=uploadImage.secure_url
  
      }
   
    const updatedCategory = await this.categoryRepo.updateCategory(id, data); // Use repository method
    return updatedCategory && !updatedCategory.isDeleted ? this.mapToDTO(updatedCategory) : null;
  }

  // Soft delete a category
  async deleteCategory(id: mongoose.Types.ObjectId): Promise<boolean> {
    return await this.categoryRepo.deleteCategory(id); // Use repository method
  }

  // List a category
  async listById(id: mongoose.Types.ObjectId): Promise<responseHandler | null> {
    const category = await this.categoryRepo.getCategoryById(id); // Use repository method
    if (category && !category.isDeleted) {
      if (category.isListed) {
        throw new Error("Category is already listed.");
      }
      category.isListed = true; // List the category
      await this.categoryRepo.updateCategory(id, category); // Use repository method to update
      return { message: "Category listed successfully" };
    }
    throw new Error("Category not found.");
  }

  // Unlist a category
  async unListById(id: mongoose.Types.ObjectId): Promise<responseHandler | null> {
    const category = await this.categoryRepo.getCategoryById(id); // Use repository method
    if (category && !category.isDeleted) {
      if (!category.isListed) {
        throw new Error("Category is already unlisted.");
      }
      category.isListed = false; // Unlist the category
      await this.categoryRepo.updateCategory(id, category); // Use repository method to update
      return { message: "Category unlisted successfully" };
    }
    throw new Error("Category not found.");
  }

  // Map Category to ProductDTO
  private mapToDTO(category: ICategory): categoryDTo {
    return {
      _id: category._id,
      name: category.name,
      photo:category.photo,
      description: category.description,
      isListed: category.isListed,
      isDeleted: category.isDeleted,
      createdAt: category.createdAt,
      updatedAt: category.updatedAt,
    };
  }
}
