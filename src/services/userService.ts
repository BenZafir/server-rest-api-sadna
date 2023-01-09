import { nanoid } from "nanoid";
import { getConnection } from "../database/database";
import { DatabaseInstance } from "../models/databaseInstance";
import { Service } from "./service";
import { UserDB } from "../models/userDB";
import { RegularUser } from "../models/regularUser";
import { AdminUser } from "../models/adminUser";

export class UserService extends Service {
    create(data: any): DatabaseInstance | null{
            const { name, email, password } = data;
            let newId = nanoid();
            let user = this.getById(newId);
            while (user) {
                newId = nanoid();
                user = this.getById(newId);
            }
            const newUser: UserDB = new UserDB(new RegularUser({
                id: newId,
                name,
                email,
                isAdmin: false,
                ordersId: []
            })
                , password);
            getConnection().get('users').push(newUser).write();
            return newUser.user;

    }
    checkDataExist(name: string): boolean {
        let userName = getConnection().get('users').find({ name: name }).value();
        if (userName) {
            return true;
        }
        return false;
    }
    checkDataValid(data: string): boolean {
        const validKeys = ['name', 'email', 'password'];
        if (!Object.keys(data).every(key => validKeys.includes(key))) {
            return false;
        }
        return true;
    }
    getall(): DatabaseInstance[] {
        let users = getConnection().get('users').value();
        let userData = users.map(u => u.user);
        return userData;
    }
    getById(id: string): DatabaseInstance {
        let user = getConnection().get('users').find({ id: id }).value();
        return user?.user;
    }
    update(id: string, updateData: any): DatabaseInstance {
        let updatedUser = getConnection().get('users').find({ id: id }).value();
        if (updateData?.isAdmin){
            updatedUser.user = new AdminUser({...updatedUser.user, ...updateData});
        }
        else{
            updatedUser.user = new RegularUser({...updatedUser.user, ...updateData});
        }
        let newUser = new UserDB(updatedUser.user, updatedUser.password);
        updatedUser = getConnection().get('users').find({ id: id }).assign(newUser).write();
        return updatedUser.user;
    }
    delete(id: string): DatabaseInstance {
        const deletedUser = getConnection().get('users').remove({ id: id }).write();
        return deletedUser[0].user;
    }
    public static getInstance(): UserService {
        if (!UserService.instance) {
            UserService.instance = new UserService();
        }
        return UserService.instance;
    }
    private static instance: UserService;
}


