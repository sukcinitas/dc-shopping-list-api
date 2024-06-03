const router = require("express").Router();
const service = require("../services/products.service");
const { db } = require("../database");

router
  .route("/:id")
  .put(async (req, res) => {
    try {
      const userId = req?.session?.user?.id || 1;
      const result = await service.editProduct(
        db,
        req.body,
        Number(req.params.id),
        userId
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
  .delete(async (req, res) => {
    try {
      await service.deleteProduct(db, req.params.id);
      res.status(200).json("Successfully deleted!");
    } catch (err) {
      console.error(err);
      res.status(500).end();
    }
  })
  .get(async (req, res) => {
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
  .get(async (req, res, next) => {
    try {
      const result = await service.getAllProducts(db, 1);
      res.status(200).json(result);
    } catch (err) {
      console.error(err);
      res.status(500).end();
    }
  })
  .post(async (req, res) => {
    try {
      const result = await service.addProduct(db, req.body);
      res.status(200).json({ id: result.lastInsertRowid });
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
