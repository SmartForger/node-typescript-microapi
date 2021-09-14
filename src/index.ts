import { Environments } from './config/environments';
import app from './app';

const port = Environments.serverPort;

app.listen(port, () => {
  try {
    process.stdout.write(`🚀... Server ready, on port ${port}\n`);
  } catch (exception) {
    process.stdout.write(exception);
  }
});
