const router = require("express").Router();

const { authorize } = require("../util/authorize");
const service = require("../services/products.service");
const { db } = require("../database");

router
  .route("/:id")
  .put(authorize, async (req, res) => {
    try {
      const user_id = req?.session?.user_id;
      const result = await service.editProduct(
        db,
        req.body,
        Number(req.params.id),
        user_id
      );
      res.status(200).json({ id: result.lastInsertRowid });
    } catch (err) {
      if (err.errno === 19) {
        res.status(400).json({
          message: "Name must be unique!",
        });
        return;
      }
      res.status(500).json(err.message);
    }
  })
  .delete(authorize, async (req, res) => {
    try {
      await service.deleteProduct(db, req.params.id);
      res.status(200).json("Successfully deleted!");
    } catch (err) {
      console.error(err);
      res.status(500).end();
    }
  })
  .get(authorize, async (req, res) => {
    try {
      const result = await service.getProduct(db, req.params.id);
      res.status(200).json(result);
    } catch (err) {
      console.error(err);
      res.status(500).end();
    }
  });

router
  .route("/")
  .get(authorize, async (req, res, next) => {
    try {
      const user_id = req?.session?.user_id;
      const result = await service.getAllProducts(db, user_id);
      res.status(200).json(result);
    } catch (err) {
      console.error(err);
      res.status(500).end();
    }
  })
  .post(authorize, async (req, res) => {
    try {
      const user_id = req?.session?.user_id;
      const result = await service.addProduct(db, req.body, user_id);
      res.status(200).json({ product_id: result.lastInsertRowid });
    } catch (err) {
      console.error(err);
      if (err.errno === 19) {
        res
          .status(400)
          .json({
            message: "Name must be unique!",
          })
          .end();
        return;
      }
      res.status(500).end();
    }
  });

module.exports = router;
