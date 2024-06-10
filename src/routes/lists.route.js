const router = require("express").Router();

const { authorize } = require("../util/authorize");
const service = require("../services/lists.service");
const { db } = require("../database");

router.route("/active").get(authorize, async (req, res, next) => {
  try {
    const user_id = req?.session?.user_id;
    const result = await service.getActiveList(db, user_id);
    res.status(200).json(result);
  } catch (err) {
    res.status(500);
  }
});

router
  .route("/:id")
  .get(authorize, async (req, res) => {
    try {
      const result = await service.getList(db, req.params.id);
      res.status(200).json(result);
    } catch (err) {
      console.error(err);
      res.status(500);
    }
  })
  .put(authorize, async (req, res) => {
    try {
      await service.updateListState(db, req.params.id, req.body.state);
      res.status(200).json({ message: "List has been successfully updated!" });
    } catch (err) {
      console.error(err);
      res.status(500);
    }
  });

router
  .route("/:id/toggle-item-completion")
  .put(authorize, async (req, res, next) => {
    try {
      await service.toggleProductInListCompletion(
        db,
        req.params.id,
        req.body.id,
        req.body.completed
      );
      res.status(200).json({ message: "Item has been successfully updated!" });
    } catch (err) {
      console.error(err);
      res.status(500);
    }
  });

router
  .route("/")
  .get(authorize, async (req, res, next) => {
    try {
      const user_id = req?.session?.user_id;
      const result = await service.getAllLists(db, user_id);
      res.status(200).json(result);
    } catch (err) {
      console.error(err);
      res.status(500);
    }
  })
  .post(authorize, async (req, res, next) => {
    try {
      const result = service.addOrUpdateListAndProductsInList(
        db,
        req.body,
        req.session?.user_id
      );
      res.status(200).json(result);
    } catch (err) {
      console.error(err);
      res.status(500);
    }
  });

module.exports = router;
