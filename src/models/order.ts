import { DatabaseInstance } from "./databaseInstance";

export class Order extends DatabaseInstance{
    constructor(
        public id: string,
        public userId: string,
        public itemsId: string[],
    ) {
        super(id);
        this.userId = userId;
        this.itemsId = itemsId;
    }
}