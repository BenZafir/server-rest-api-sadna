import { DatabaseInstance } from "./databaseInstance";

export abstract class Person extends DatabaseInstance{
    constructor(
      public id: string,
      public name: string,
    ){
        super(id);
        this.name = name;
    }

  }