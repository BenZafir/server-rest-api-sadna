import { AdminUser } from "./adminUser";
import { RegularUser } from "./regularUser";
import { User } from "./user";

export class UserDB extends User{
    constructor(
        public user: User,
        public password: string) {
        super(user.id, user.name, user.email, user.isAdmin, user.ordersId);
        this.user = user;
        this.password = password;
    }
}