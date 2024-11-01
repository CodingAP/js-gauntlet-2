import path from 'node:path';
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import apiRouter from './src/api.js';
import stageRouter from './src/stage.js';

// ten_them
// cHVibGljL2ltZy9jb25ncmF0cy5wbmc=

const __dirname = path.resolve();

const app = express();
const PORT = 80;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));
app.use(express.urlencoded({ extended: false }))
app.use(express.json());
app.use(cookieParser());
app.use(cors());

app.use('/api', apiRouter);
app.use('/stage', stageRouter);
app.get('/', (request, response) => {
    response.redirect('/stage/1');
});
app.use('/', express.static(path.join(__dirname, '/public')));

app.listen(PORT, () => {
    console.log(`JS Gauntlet 2 hosted on http://localhost:${PORT}...`);
});