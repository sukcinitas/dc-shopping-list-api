const formatDate = require("../util/formatDate");

const getProduct = (db, id) => {
  return db.prepare(`SELECT * FROM products WHERE product_id = ?`).get(id);
};

const getAllProducts = (db, id) => {
  return db.prepare(`SELECT * FROM products WHERE user_id = ?`).all(id);
};

const addProduct = (db, { name, url, description, category }, user_id) => {
  return db
    .prepare(
      `INSERT INTO products (name, category, description, url, user_id) VALUES (?,?,?,?,?)`
    )
    .run(name, category, description, url, user_id);
};

const editProduct = (db, { name, url, description, category }, id, user_id) => {
  return db
    .prepare(
      `UPDATE products SET name = ?, category = ?, description = ?, url = ?, user_id = ? WHERE product_id = ?`
    )
    .run(name, category, description, url, user_id, id);
};

const deleteProduct = (db, id) => {
  const date = formatDate(new Date());
  return db
    .prepare(`UPDATE products SET deleted_at = ? WHERE product_id = ?`)
    .run(date, id);
};

module.exports = {
  getProduct,
  getAllProducts,
  addProduct,
  editProduct,
  deleteProduct,
};
