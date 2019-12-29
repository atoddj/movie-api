import express from 'express';
import cors from 'cors';
import models, {connectDb, connectSql} from './models';
import routes from './routes';
import 'dotenv/config';

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(async (req, res, next) => {
    req.context = {
      models,
      connectSql
    };
    next();
  });

app.get('/api',(req,res) => {
    res.status(200).send({success: true})
})

app.use('/api/requests', routes.requests);
app.use('/api/search', routes.search);
app.use('/api/auth', routes.session);
app.use('/api/plex/latest', routes.latest);
app.use('/api/tv', routes.tv);

connectDb().then(async () => {
    app.listen(process.env.PORT, () => {
        console.log(`app is listening to port ${process.env.PORT}`);
    });
});