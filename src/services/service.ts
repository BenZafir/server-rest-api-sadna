import { DatabaseInstance } from "../models/databaseInstance";

export abstract class Service{
    abstract create(data: any): DatabaseInstance | null;
    abstract checkDataExist(name: string): boolean;
    abstract checkDataValid(data: string): boolean;
    abstract getall(): DatabaseInstance[];
    abstract getById(id: string): DatabaseInstance;
    abstract update(id: string, updateData: any): DatabaseInstance;
    abstract delete(id: string): DatabaseInstance;
}