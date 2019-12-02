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
            let pendingMatch = await req.context.models.Request.findOne({_id: tmdb.id});
            let plexDb;
            if (tmdb.title) {
                plexDb= req.context.connectSql();
                const stmt = plexDb.prepare(`SELECT title FROM metadata_items
                WHERE title = ? AND year = ?`);
                const year = Number(new Date(tmdb.release_date).getFullYear());
                let availableMatch = stmt.get(tmdb.title, year);
                plexDb.close();
                if (availableMatch) {    
                    return {...tmdb, status: 'Available'}
                }
            }
            if (tmdb.name) {
                plexDb = req.context.connectSql();
                let stmt = plexDb.prepare(`SELECT title, id, [index] FROM metadata_items WHERE title = ? AND year = ?`);
                const year = Number(new Date(tmdb.first_air_date).getFullYear());
                let availableMatch = stmt.get(tmdb.name, year);
                if (availableMatch) {
                    stmt = plexDb.prepare(`SELECT [index] FROM metadata_items WHERE parent_id = ?`);
                    let seasons = stmt.all(availableMatch.id).map(s => (s.index)).sort((a,b) => (a-b));
                    plexDb.close();
                    return {...tmdb, status: 'Available', seasons}
                } else {
                    plexDb.close();
                }
            }
            if (pendingMatch) {
                return {...tmdb, status: pendingMatch.status}
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