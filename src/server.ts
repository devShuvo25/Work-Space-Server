import { Server } from 'http';
import app from './app';
import seedSuperAdmin from './app/DB';
import config from './config';
import { setupSocket } from './config/socket.configue';

const port = config.port || 5000;

export let io: any;

async function main() {
  const server: Server = app.listen(port, () => {
    console.log('Sever is running on port ', port);
    seedSuperAdmin();
  });

  io = setupSocket(server)

  const exitHandler = () => {
    if (server) {
      server.close(() => {
        console.info('Server closed!');
      });
    }
    process.exit(1);
  };

  process.on('uncaughtException', error => {
    console.log(error);
    exitHandler();
  });

  process.on('unhandledRejection', error => {
    console.log(error);
    exitHandler();
  });

  
}

main();
