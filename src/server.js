import express from 'express';
import bodyParser from 'body-parser';

const app = express();

app.use(bodyParser.json());

app.get('/',(req,res) => {
    res.status(200).send({success: true})
})

app.listen(4000,() => {
    console.log(`app is listening to port 4000`);
})