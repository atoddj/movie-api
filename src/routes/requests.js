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

export default router;