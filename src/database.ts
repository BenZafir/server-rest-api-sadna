import Lowdb from 'lowdb';
import FileSync from 'lowdb/adapters/FileSync';

type User = {
  id: string;
  name: string;
  password? : string;
  email: string;
  isAdmin: boolean;
  ordersId: string[];
}
type Category = {
  id: string;
  name: string;
  img: string;
}
type Item = {
  id: string;
  name: string;
  img: string;
  category: string;
  price: string;
}
type Order = {
  id: string;
  userId: string;
  itemsId: string[];
}
type Schema = {
  users: User[],
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
