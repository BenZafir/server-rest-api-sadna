import { nanoid } from "nanoid";
import { getConnection } from "../database/database";
import { DatabaseInstance } from "../models/databaseInstance";
import { Service } from "./service";
import { UserDB } from "../models/userDB";
import { RegularUser } from "../models/regularUser";

export class CategoryService extends Service {
    create(data: any): DatabaseInstance | null{
        const { name,imageUrl} = data;
        const newCategory = {
          id: nanoid(),
          name,
          imageUrl
        };
        getConnection().get('categories').push(newCategory).write();
        return newCategory;
    }
    checkDataExist(name: string): boolean {
        let userName = getConnection().get('categories').find({ name: name }).value();
        if (userName) {
            return true;
        }
        return false;
    }
    checkDataValid(data: string): boolean {
        const validKeys = ['name', 'id','imageUrl'];
        if (!Object.keys(data).every(key => validKeys.includes(key))) {
            return false;
        }
        return true;
    }
    getall(): DatabaseInstance[] {
        let items = getConnection().get('categories').value();
        return items;
    }
    getById(id: string): DatabaseInstance {
        let item = getConnection().get('categories').find({ id: id }).value();
        return item;
    }
    update(id: string, updateData: any): DatabaseInstance {
        const updatedItem = getConnection().get('categories').find({ id: id }).assign(updateData).write();
        return updatedItem;
    }
    delete(id: string): DatabaseInstance {
        const deletedItem = getConnection().get('categories').remove({ id: id }).write();
        return deletedItem[0];
    }
    public static getInstance(): CategoryService {
        if (!CategoryService.instance) {
            CategoryService.instance = new CategoryService();
        }
        return CategoryService.instance;
    }
    private static instance: CategoryService;
}


