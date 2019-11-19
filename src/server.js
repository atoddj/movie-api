import express from 'express';
import cors from 'cors';
import models, {connectDb} from './models';
import routes from './routes';
import 'dotenv/config';

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(async (req, res, next) => {
    req.context = {
      models
    };
    next();
  });

app.get('/',(req,res) => {
    res.status(200).send({success: true})
})

app.use('/requests', routes.requests);

connectDb().then(async () => {
    app.listen(process.env.PORT, () => {
        console.log(`app is listening to port ${process.env.PORT}`);
    });
});