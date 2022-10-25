import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import userRoutes from './routes/user.routes';
import categoriesRoutes from './routes/categories.routes';
import itemRoutes from './routes/item.routes';
import orderRoutes from './routes/order.routes';
import swaggerUI from 'swagger-ui-express';
import yaml from 'yamljs';

const app = express();

app.set('port', process.env.PORT || 3000);

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

app.use(userRoutes);
app.use(categoriesRoutes);
app.use(itemRoutes);
app.use(orderRoutes);

const swaggerDocument = yaml.load('./swagger.yaml');
app.use('/docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument));
// http://localhost:3000/docs/

export default app;