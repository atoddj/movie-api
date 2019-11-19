import mongoose from 'mongoose';

const RequestSchema = new mongoose.Schema({
    _id: String,
    movie_name: String,
    url: String,
    year: String,
    status: String,
    timestamp: Object,
    mediatype: String
}, {
    collection: 'requests'
});

const Request = mongoose.model('Request', RequestSchema);

export default Request;