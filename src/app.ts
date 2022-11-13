import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import userRoutes from './routes/user.routes';
import categoriesRoutes from './routes/categories.routes';
import itemRoutes from './routes/item.routes';
import orderRoutes from './routes/order.routes';
import logginRoutes from './routes/loggin.routes';
import swaggerUI from 'swagger-ui-express';
import yaml from 'yamljs';

const app = express();

app.set('port', process.env.PORT || 3000);

app.use(cors());
app.use(morgan('dev'));
app.use(express.json()); //to send json requests inside body

app.use(userRoutes);
app.use(categoriesRoutes);
app.use(itemRoutes);
app.use(orderRoutes);
app.use(logginRoutes);


const swaggerDocument = yaml.load('./swagger.yaml');
app.use('/docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument));
// http://localhost:3000/docs/

export default app;