import { nanoid } from "nanoid";
import { getConnection } from "../database/database";
import { DatabaseInstance } from "../models/databaseInstance";
import { Service } from "./service";
import { UserDB } from "../models/userDB";
import { RegularUser } from "../models/regularUser";

export class ItemService extends Service {
    create(data: any): DatabaseInstance | null{
        const { name, imageUrl, category, price } = data;
        const categoryCheck = getConnection().get('categories').find({ name: category }).value();
        if (!categoryCheck) {
          return null;
        }
        const newItem = {
          id: nanoid(),
          name,
          imageUrl,
          category,
          price,
        };
        getConnection().get('items').push(newItem).write();
        return newItem;

    }
    checkDataExist(name: string): boolean {
        let userName = getConnection().get('items').find({ name: name }).value();
        if (userName) {
            return true;
        }
        return false;
    }
    checkDataValid(data: string): boolean {
        const validKeys = ['name', 'id', 'imageUrl', 'category', 'price'];
        if (!Object.keys(data).every(key => validKeys.includes(key))) {
            return false;
        }
        return true;
    }
    getall(): DatabaseInstance[] {
        let items = getConnection().get('items').value();
        return items;
    }
    getById(id: string): DatabaseInstance {
        let item = getConnection().get('items').find({ id: id }).value();
        return item;
    }
    update(id: string, updateData: any): DatabaseInstance {
        const updatedItem = getConnection().get('items').find({ id: id }).assign(updateData).write();
        return updatedItem;
    }
    delete(id: string): DatabaseInstance {
        const deletedItem = getConnection().get('items').remove({ id: id }).write();
        return deletedItem[0];
    }
    public static getInstance(): ItemService {
        if (!ItemService.instance) {
            ItemService.instance = new ItemService();
        }
        return ItemService.instance;
    }
    private static instance: ItemService;
}


