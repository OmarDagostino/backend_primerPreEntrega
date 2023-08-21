import express from 'express';
import bodyParser from 'body-parser';
import apiRouter from './routes/users.routes.js';

const app = express();
const PORT = 8080;

app.use(bodyParser.json());
app.use(express.json);

app.use('/api', apiRouter);

app.listen(PORT, () => {
  console.log(`Servidor en funcionamiento en el puerto ${PORT}`);
});
