import app from './app';
import { createConnection } from './database';

createConnection();

app.listen(app.get('port'));

console.log('Server listening on port 4000'); 