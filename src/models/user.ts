import { Person } from "./person";

export abstract class User extends Person {
    constructor(
        public id: string,
        public name: string,
        public email: string,
        public isAdmin: boolean,
        public ordersId: string[]) {
        super(id, name);
        this.email = email;
        this.isAdmin = isAdmin;
        this.ordersId = ordersId;
    }
}