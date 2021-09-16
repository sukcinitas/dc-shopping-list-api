const router = require('express').Router();
const service = require('../service');
const { db } = require('../database');

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

router.put('/save-list', async (req, res, next) => {
    try {
        const result = await service.addOrUpdateListAndProductsInList(db, req.body);
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

router.put('/:id/toggle-item-completion', async (req, res, next) => {
    try {
        await service.toggleProductInListCompletion(db, req.params.id, req.body.id, req.body.completed);
        res.status(200).json({message: 'Item has been successfully updated!'});
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