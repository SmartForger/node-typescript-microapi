import express from 'express';
import v1Routes from './controllers/v1';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/public', express.static('public'));

app.use('/api/v1', v1Routes);

app.use('/', (req, res) => {
  res.send('API is running...');
});

export default app;
