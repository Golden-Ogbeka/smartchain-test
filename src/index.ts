// src/index.ts
import express from 'express';
import { ensureConnection } from './utils/db';

const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.send('Hello, TypeScript with Express!');
}); 

ensureConnection().then(async (db:any) => {
})
.catch((err) => console.log(err));

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
