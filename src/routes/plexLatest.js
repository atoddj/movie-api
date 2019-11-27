import Router from 'express';

const router = Router();

router.get('/', async (req, res) => {
    let db = await req.context.connectSql();
    res.status(200).send({success: true});
    db.close();
});

export default router;