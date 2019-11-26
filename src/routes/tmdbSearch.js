import Router from 'express';
import Axios from 'axios';

const router = Router();

router.get('/', async (req, res) => {
    if(req.query.q) {
        let tmdbRes = await Axios.get(process.env.TMDB_SEARCH_URL, {
            params: {
                api_key: process.env.TMDB_API_KEY,
                query: req.query.q
            }
        });
        let returnedResponse = await Promise.all(tmdbRes.data.results.map(async (tmdb) => {
            let found = await req.context.models.Request.findOne({_id: tmdb.id});
            if (found) {
                return {...tmdb, status: found.status}
            }
            return tmdb;
        }));
        tmdbRes.data.results = returnedResponse;
        res.status(200).send(tmdbRes.data);
    } else {
        res.send({success: false, message: "Include search parameter 'q' in url with a search term."})
    }
    
})

export default router;