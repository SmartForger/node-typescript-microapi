import dotenv from 'dotenv';

dotenv.config();

export class Environments {
  static readonly serverPort = process.env.SERVER_PORT || 8080;
}
