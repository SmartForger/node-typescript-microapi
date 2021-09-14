import express from 'express';
import { PeopleController } from './controllers/people.controller';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/people', new PeopleController().getRoutes());

app.use('/', (req, res) => {
  res.send('API is running ...');
});

export default app;
