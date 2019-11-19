import mongoose from 'mongoose';
import 'dotenv/config';
import Request from './request';

const connectDb = () => (
    mongoose.connect(process.env.DATABASE_URL, {useNewUrlParser: true, useUnifiedTopology: true})
)

const models = {Request};

export {connectDb};

export default models;