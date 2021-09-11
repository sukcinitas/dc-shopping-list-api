const router = require('express').Router();
const service = require('../service');
import { db } from '../server';

router.get('/top-categories', async (req, res, next) => {
    try {
        const ans = await service.getTopCategories(db);
        res.status(200).json(ans);
    } catch (err) {
        console.error(err);
        res.status(400);
    }
});

router.get('/top-items', async (req, res, next) => {
    try {
        const ans = await service.getTopItems(db);
        res.status(200).json(ans);
    } catch (err) {
        console.error(err);
        res.status(400);
    }
});

router.get('/monthly-statistics', async (req, res, next) => {
    try {
        const ans = await service.getMonthlyStatistics(db);
        res.status(200).json(ans);
    } catch (err) {
        console.error(err);
        res.status(400);
    }
});

module.exports = router;