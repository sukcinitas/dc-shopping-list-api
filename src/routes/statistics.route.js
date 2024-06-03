const router = require("express").Router();

const { authorize } = require("../util/authorize");
const service = require("../services/statistics.service");
const { db } = require("../database");

router.get("/top-categories", authorize, async (req, res, next) => {
  try {
    const user_id = req?.session?.user?.id;
    const ans = await service.getTopCategories(db, user_id);
    res.status(200).json(ans);
  } catch (err) {
    console.error(err);
    res.status(500);
  }
});

router.get("/top-items", authorize, async (req, res, next) => {
  try {
    const user_id = req?.session?.user?.id;
    const ans = await service.getTopItems(db, user_id);
    res.status(200).json(ans);
  } catch (err) {
    console.error(err);
    res.status(500);
  }
});

router.get("/monthly-statistics", authorize, async (req, res, next) => {
  try {
    const user_id = req?.session?.user?.id;
    const ans = await service.getMonthlyStatistics(db, user_id);
    res.status(200).json(ans);
  } catch (err) {
    console.error(err);
    res.status(500);
  }
});

module.exports = router;
