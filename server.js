const http = require('http');
const express = require('express');
const app = express();


app.use(express.json());

app.use('/', (req, res) => {
    res.send('todo api works')
});

const server = http.createServer(app);

const port = 3000;

server.listen(port);

console.debug(`server listening: http://localhost:${port}`);