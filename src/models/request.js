import mongoose from 'mongoose';

const RequestSchema = new mongoose.Schema({
    _id: String,
    movie_name: String,
    year: String,
    status: String,
    timestamp: Object,
    mediatype: String,
    backdrop_path: String,
    poster_path: String,
    overview: String

}, {
    collection: 'requests'
});

const Request = mongoose.model('Request', RequestSchema);

export default Request;