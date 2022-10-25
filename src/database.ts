import Lowdb from 'lowdb';
import FileSync from 'lowdb/adapters/FileSync';

type User = {
  id: string;
  name: string;
  email: string;
}
type Category = {
  id: string;
  name: string;
}

type Item = {
  id: string;
  name: string;
  category: string;
  price: string;
}
type Schema = {
  users: User[],
  category: Category[];
  item: Item[];
}

let db: Lowdb.LowdbSync<Schema>;

export const createConnection = () => {
  const adapter = new FileSync<Schema>('db.json');
  db = Lowdb(adapter);
  db.defaults({ users: []}).write();
  db.defaults({ category: []}).write();
  db.defaults({ item: []}).write();
}

export const getConnection = () => db;
