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
        movie_name: request.title,
        year: new Date(request.release_date).getFullYear(),
        status: 'pending',
        timestamp: new Date(),
        mediatype: request.media_type
    });
    return res.send({success: true, status: newRequest.status});
})

export default router;