import { DatabaseInstance } from "./databaseInstance";

export class Item extends DatabaseInstance{
    constructor(
        public id: string,
        public name: string,
        public price: number,
        public imageUrl: string,
        public category: string,
    ) {
        super(id);
        this.name = name;
        this.price = price;
        this.imageUrl = imageUrl;
        this.category = category;
    }
}