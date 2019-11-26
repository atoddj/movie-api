import {Router} from 'express';

const router = Router();

router.get('/', (req, res, next) => {
    let isLoggedIn = false;
    if(req.query.admin) {
        isLoggedIn = req.query.admin === process.env.ADMIN_TOKEN
    } 
    res.status(200).send({isLoggedIn});
});

export default router;