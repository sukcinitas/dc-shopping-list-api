const router = require('express').Router();
const service = require('../service');
const { db } = require('../database');

router.get('/', async (req, res, next) => {
    try {
        const result = await service.getAllProducts(db, 1);
        res.status(200).json(result);
    } catch (err) {
        console.error(err);
        res.status(400);
    }
});

router.get('/:id', async (req, res, next) => {
    try {
        const result = await service.getProduct(db, req.params.id);
        res.status(200).json(result);
    } catch (err) {
        console.error(err);
        res.status(400);
    }
});

router.post('/', async (req, res) => {
    try {
        await service.addProduct(db, req.body);
        res.status(200).json({message: 'Successfully added!'});
    } catch (err) {
        console.error(err);
        res.status(400);
    }
});

router.delete('/:id', async (req, res) => {
    try {
        await service.deleteProduct(db, req.params.id);
        res.status(200).json({message: 'Successfully deleted!'});
    } catch (err) {
        console.error(err);
        res.status(400);
    }
});


module.exports = router;