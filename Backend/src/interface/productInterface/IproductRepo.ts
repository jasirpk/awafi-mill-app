import mongoose from "mongoose";
import { ProductCreationDTO, ProductDTO } from "../../domain/dtos/ProductDTO";
import Product from "../../domain/entities/productSchema";
import {ProductResponse} from '../../types/productTypes'

export interface IproductRepo {
  addProduct(productData: ProductCreationDTO): Promise<Product>;
  addBulkProduct(productData:any):Promise<void>
  updateProduct(id: mongoose.Types.ObjectId, data: Partial<ProductCreationDTO>): Promise<Product | null>;
  findByName(name: string): Promise<Product | null>;
  findByNameAndNotCurrentId(id: mongoose.Types.ObjectId, name: string): Promise<Product | null>;
  findAllProducts(page:number,limit:number): Promise<ProductResponse>;
  findAllProductsInJsonWithAggregation(): Promise<ProductResponse>;
  findListedAllProducts(page:number,limit:number): Promise<ProductResponse>;
  findProductsBySpelling(page:number,limit:number,name:string): Promise<ProductResponse>;
  productFindById(id: mongoose.Types.ObjectId): Promise<Product | null>;
  fetchByCategoryAndName(page:number,limit:number,filter:any): Promise<ProductDTO[] | null>;
  listProductsBySubcategories(page:number,limit:number,mainCatId:mongoose.Types.ObjectId): Promise<ProductDTO[] | null>;
  updateImage(id: mongoose.Types.ObjectId, index: number, imageUrl: string): Promise<{ modifiedCount: number }>;
  deleteProduct(id: mongoose.Types.ObjectId): Promise<boolean>;
  updateListing(id: mongoose.Types.ObjectId, data: { isListed: boolean }): Promise<{ modifiedCount: number }>;
  isListedProduct(id: mongoose.Types.ObjectId): Promise<Product | null>; // Change return type to boolean
}
