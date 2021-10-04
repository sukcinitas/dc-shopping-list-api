const router = require('express').Router();
const service = require('../services/statistics.service');
const { db } = require('../database');

router.get('/top-categories', async (req, res, next) => {
    try {
        const ans = await service.getTopCategories(db);
        res.status(200).json(ans);
    } catch (err) {
        console.error(err);
        res.status(500);
    }
});

router.get('/top-items', async (req, res, next) => {
    try {
        const ans = await service.getTopItems(db);
        res.status(200).json(ans);
    } catch (err) {
        console.error(err);
        res.status(500);
    }
});

router.get('/monthly-statistics', async (req, res, next) => {
    try {
        const ans = await service.getMonthlyStatistics(db);
        res.status(200).json(ans);
    } catch (err) {
        console.error(err);
        res.status(500);
    }
});

module.exports = router;