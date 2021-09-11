const router = require('express').Router();
const service = require('../service');
const { db } = require('../server');

// Lists
router.get('/active', async (req, res, next) => {
    try {
        const result = await service.getActiveList(db);
        res.status(200).json(result);
    } catch (err) {
        console.error(err);
        res.status(500);
    }
});

router.get('/:id', async (req, res, next) => {
    try {
        const result = await service.getList(db, req.params.id);
        res.status(200).json(result);
    } catch (err) {
        console.error(err);
        res.status(500);
    }
});

router.put('/:id', async (req, res, next) => {
    try {
        await service.updateListState(db, req.params.id, req.body.state);
        res.status(200).json({message: 'List has been successfully updated!'});
    } catch (err) {
        console.error(err);
        res.status(500);
    }
});

router.get('/', async (req, res, next) => {
    try {
        const result = await service.getAllLists(db);
        res.status(200).json(result);
    } catch (err) {
        console.error(err);
        res.status(500);
    }
});

module.exports = router;