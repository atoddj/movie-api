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
        res.status(200).send(tmdbRes.data);
    } else {
        res.send({success: false, message: "Include search parameter 'q' in url with a search term."})
    }
    
})

export default router;