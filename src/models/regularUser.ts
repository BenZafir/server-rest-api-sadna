import { User } from "./user";

export class RegularUser extends User{
    constructor(
        user: User) {
        super(user.id, user.name, user.email, false, user.ordersId);
    }
}