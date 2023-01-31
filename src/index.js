import express from "express";
import bodyParser from "body-parser";
import walletsRoutes from './routes/wallets.js';

const app = express();

app.use(bodyParser.json());

app.use('/wallets', walletsRoutes);

app.get('/', (req, res) => res.send('Welcome to Homepage!'));

app.listen(3000, () => console.log('Listening on port 3000...'));
