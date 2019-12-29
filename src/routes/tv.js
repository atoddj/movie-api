import {Router} from 'express';
import Axios from 'axios';

const router = Router();

router.get('/:id', async (req, res) => {
    const id = req.params.id;
    res.status(200);
    const tmdbRes = await Axios.get(`${process.env.TMDB_TV_URL}/${id}`, {
        params: {
            api_key: process.env.TMDB_API_KEY
        }
    });
    res.send(tmdbRes.data);
});

export default router;