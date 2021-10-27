import express from 'express';
import { PeopleController } from './people.controller';

const router = express.Router();

router.use('/people', new PeopleController().getRoutes());

export default router;
