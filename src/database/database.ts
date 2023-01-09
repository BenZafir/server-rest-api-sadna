import Lowdb from 'lowdb';
import FileSync from 'lowdb/adapters/FileSync';
import { UserDB } from '../models/userDB';
import { Category } from '../models/category';
import { Item } from '../models/item';
import { Order } from '../models/order';


type Schema = {
  users: UserDB[],
  categories: Category[];
  items: Item[];
  orders: Order[];
}

let db: Lowdb.LowdbSync<Schema>;

export const createConnection = () => {
  const adapter = new FileSync<Schema>('db.json');
  db = Lowdb(adapter);
  db.defaults({ users: []}).write();
  db.defaults({ categories: []}).write();
  db.defaults({ items: []}).write();
  db.defaults({ orders: []}).write();
}

export const getConnection = () => db;
