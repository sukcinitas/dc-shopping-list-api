const formatDate = require("../util/formatDate");

const getList = (db, list_id) => {
  const row = db.prepare(`SELECT * FROM lists WHERE list_id = ?`).get(list_id);

  const rows = db
    .prepare(
      `SELECT a.id, a.units AS pieces, a.completed, b.product_id as product_id, b.name, b.description, b.url, b.category FROM productsInLists a FULL JOIN products b ON a.product_id=b.product_id WHERE list_id = ?`
    )
    .all(list_id);
  return {
    ...row,
    items: rows.map((item) => ({
      ...item,
      completed: Boolean(parseInt(item.completed)),
    })),
  };
};

const addOrUpdateListAndProductsInList = (
  db,
  { name, state, list_id, items },
  user_id
) => {
  let new_list_id = null;
  if (!list_id) {
    const { lastInsertRowid } = db
      .prepare(
        `INSERT INTO lists (name, state, updated_at, user_id) VALUES (?,?,?,?)`
      )
      .run(name, state, formatDate(new Date()), user_id);
    new_list_id = lastInsertRowid;
  } else {
    const { lastInsertRowid } = db
      .prepare(
        `REPLACE INTO lists (name, state, list_id, updated_at, user_id) VALUES (?,?,?,?,?)`
      )
      .run(name, state, list_id, formatDate(new Date()), user_id);
    new_list_id = lastInsertRowid;

    // delete list products
    db.prepare(`DELETE FROM productsInLists WHERE list_id = ?`).run(list_id);
  }

  // add list products
  items.forEach((item) => {
    db.prepare(
      "INSERT INTO productsInLists (units, product_id, completed, list_id) VALUES (?,?,?,?)"
    ).run(item.units, item.product_id, item.completed, new_list_id);
  });

  const rows = db
    .prepare(
      `SELECT a.id, a.units AS pieces, a.completed, b.product_id as product_id, b.name, b.category FROM productsInLists a FULL JOIN products b ON a.product_id=b.product_id WHERE list_id = ?`
    )
    .all(new_list_id);
  return {
    list: {
      name,
      state,
      list_id: new_list_id,
      items: rows.map((item) => ({
        ...item,
        completed: Boolean(parseInt(item.completed)),
      })),
    },
  };
};

const toggleProductInListCompletion = (db, list_id, id, completed) => {
  return db
    .prepare(`UPDATE productsInLists SET completed = ? WHERE id = ?`)
    .run(String(completed), id);
};

const getActiveList = (db, user_id) => {
  const activeList = db
    .prepare(`SELECT * FROM lists WHERE user_id = ? AND state = ?`)
    .get(user_id, "active");
  if (!activeList) {
    return undefined;
  }
  const items = db
    .prepare(
      `SELECT a.id, a.units AS pieces, a.completed, b.product_id as product_id, b.name, b.category FROM productsInLists a FULL JOIN products b ON a.product_id=b.product_id WHERE list_id = ?`
    )
    .all(activeList.list_id);
  return {
    ...activeList,
    items: items.map((item) => ({
      ...item,
      completed: Boolean(parseInt(item.completed)),
    })),
  };
};

const updateListState = (db, list_id, state) => {
  return db
    .prepare(`UPDATE lists SET state = ? WHERE list_id = ?`)
    .run(state, list_id);
};

const getAllLists = (db, user_id) => {
  return db.prepare(`SELECT * FROM lists where user_id = ?`).all(user_id);
};

module.exports = {
  getList,
  getActiveList,
  getAllLists,
  toggleProductInListCompletion,
  updateListState,
  addOrUpdateListAndProductsInList,
};
