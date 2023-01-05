import { User } from "./user";

export class AdminUser extends User{
    constructor(
        user: User) {
        super(user.id, user.name, user.email, true, user.ordersId);
    }
}