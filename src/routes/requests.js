import { Router } from 'express';

const router = Router();

router.get('/', async (req, res) => {
    res.status(200);
    let requests;
    if(req.query) {
        requests = await req.context.models.Request.find(req.query);
    } else {
        requests = await req.context.models.Request.find();
    }
    return res.send(requests);
});

router.post('/', async (req, res) => {
    const request = req.body;
    const newRequest = await req.context.models.Request.create({
        _id: request.id,
        movie_name: request.title || request.name,
        year: new Date(request.release_date || request.first_air_date).getFullYear(),
        status: 'pending',
        timestamp: new Date(),
        mediatype: request.media_type,
        backdrop_path: request.backdrop_path,
        poster_path: request.poster_path,
        overview:request.overview
    });
    return res.send({success: true, status: newRequest.status});
});

router.get('/update', async (req, res) => {
    res.status(200);
    let requests = await req.context.models.Request.find({status: 'pending'});
    let found = []
    requests.forEach((r) => {
        let plexDb = req.context.connectSql();
        const stmt = plexDb.prepare(`SELECT title, year, guid FROM metadata_items
        WHERE title = ? AND duration IS NOT NULL`);
        let availableMatch = stmt.get(r.movie_name);
        plexDb.close();
        if (availableMatch) {
            const regex = /themoviedb:\/\/(.*)\?/gm;
            let match = regex.exec(availableMatch.guid);
            let group = match ? match[1] : null;
            if (Number(r.year) === availableMatch.year || group === r._id) {
                // if match in the plexdb by title, check against the stored year or check against the tmdb id
                r.status = 'complete';
                r.save();
                found = [...found, availableMatch];    
            }
        }
    });
    if (found.length > 0) {   
        return res.send(found);
    } else {
        return res.send({message: 'no updates', status: 'complete'});
    }
});

router.put('/:id', async(req, res) => {
    const id = req.params.id;
    const filter = {_id: id};
    const update = req.body;
    let match = req.context.models.Request.findOneAndUpdate(filter, update, {useFindAndModify: false, new: true}, (err, result) => {
        if(err) console.error(err);
        console.log(result);
    });
    return res.status(200).send({status: 'ok'})
});

router.delete('/:id', async (req, res) => {
    const isLoggedIn = req.body.admin === process.env.ADMIN_TOKEN;
    const idToDelete = req.params.id;
    if (isLoggedIn) {
        const deleted = await req.context.models.Request.deleteOne({_id: idToDelete});
        if (deleted.deletedCount === 1) {
            return res.send({deleted: true, message: `deleted entry where _id = ${idToDelete}`});
        } else {
            return res.send({status: 'ERROR', message: `id ${idToDelete} not found in database`, deleted: false});
        }
    } else {
        return res.send({status: 'ERROR', message: 'Authentication failed'});
    }
})

export default router;