import { nanoid } from "nanoid";
import { getConnection } from "../database/database";
import { DatabaseInstance } from "../models/databaseInstance";
import { Service } from "./service";
import { UserDB } from "../models/userDB";
import { RegularUser } from "../models/regularUser";
import { UserService } from "./userService";

export class OrderService extends Service {
    checkItemToOrder = (itemsId: string[]):boolean => {
        return itemsId.every(i => getConnection().get('items').find({ id: i }).value() != undefined)
      }

    create(data: any): DatabaseInstance | null {
        const {itemsId} = data;
        let userId = data.userId;
        const userCheck = UserService.getInstance().getById(userId) as UserDB;
        if(!userCheck || this.checkItemToOrder(data.itemsId) == false)
        {
          return null;
        }
        const newOrder = {
          id: nanoid(),
          userId,
          itemsId,
        };
        getConnection().get('orders').push(newOrder).write();
        userCheck.ordersId.push(newOrder.id)
        getConnection().get('users').find({ id: userCheck.id }).assign(userCheck).write();
        return newOrder;
    }
    checkDataExist(name: string): boolean {
        return true;
    }
    checkDataValid(data: string): boolean {
        const validKeys = ['itemsId', 'userId', 'id'];
        if (!Object.keys(data).every(key => validKeys.includes(key))) {
            return false;
        }
        return true;
    }
    getall(): DatabaseInstance[] {
        let items = getConnection().get('orders').value();
        return items;
    }
    getById(id: string): DatabaseInstance {
        let item = getConnection().get('orders').find({ id: id }).value();
        return item;
    }
    update(id: string, updateData: any): DatabaseInstance {
        const updatedItem = getConnection().get('orders').find({ id: id }).assign(updateData).write();
        return updatedItem;
    }
    delete(id: string): DatabaseInstance {
        const deletedItem = getConnection().get('orders').remove({ id: id }).write();
        return deletedItem[0];
    }
    public static getInstance(): OrderService {
        if (!OrderService.instance) {
            OrderService.instance = new OrderService();
        }
        return OrderService.instance;
    }
    private static instance: OrderService;
}


