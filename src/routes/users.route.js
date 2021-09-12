const router = require('express').Router();
const service = require('../service');
const{ db } = require('../database');

router.get('/users/:id', async (req, res, next) => {
    try {
        const ans = await service.getUser(db, req.params.id);
        res.status(200).json(ans);
    } catch (err) {
        console.error(err);
        res.status(400);
    }
});

module.exports = router;