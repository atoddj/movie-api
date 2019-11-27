import mongoose from 'mongoose';
import Database from 'better-sqlite3'
import 'dotenv/config';
import Request from './request';

const connectDb = () => (
    mongoose.connect(process.env.DATABASE_URL, {useNewUrlParser: true, useUnifiedTopology: true})
)

const connectSql = () => (
    new Database(process.env.PLEX_DB_PATH)
)

const models = {Request};

export {connectDb, connectSql};

export default models;