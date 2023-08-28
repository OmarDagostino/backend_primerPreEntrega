import express from 'express';
import apiCartRouter from './routes/carts.routes.js';
import apiProductRouter from './routes/products.routes.js';

const app = express();
const PORT = 8080;

app.use(express.json());

app.use('/api', apiCartRouter);
app.use('/api', apiProductRouter);

app.listen(PORT, () => {
  console.log(`Servidor en funcionamiento en el puerto ${PORT}`);
});
