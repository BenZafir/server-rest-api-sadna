import { DatabaseInstance } from "./databaseInstance";

export class Category extends DatabaseInstance {
    constructor(
        public id: string,
        public name: string,
        public imageUrl: string,
    ) {
        super(id);
        this.name = name;
        this.imageUrl = imageUrl;
    }
}