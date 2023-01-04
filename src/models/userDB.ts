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
    public update(user: User){
        this.email = user.email;
        this.isAdmin = user.isAdmin;
        this.ordersId = user.ordersId;
        if (this.isAdmin){
            this.user = new AdminUser(this.user);
        }
        else{
            this.user = new RegularUser(this.user);
        }
    }
}