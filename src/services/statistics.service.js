const getTopCategories = async (db, user_id = 1) => {
  return db
    .prepare(
      `SELECT b.category AS name, COUNT(b.category) * 100 / COUNT(*) AS percent FROM productsInLists a LEFT JOIN products b ON a.product_id=b.product_id WHERE user_id = ? GROUP BY b.category LIMIT 3`
    )
    .all(user_id);
};

const getTopItems = async (db, user_id = 1) => {
  return db
    .prepare(
      `SELECT b.name, COUNT(b.name) * 100 / COUNT(*) AS percent FROM productsInLists a LEFT JOIN products b ON a.product_id=b.product_id WHERE user_id = ? GROUP BY b.name LIMIT 3`
    )
    .all(user_id);
};

// all of this year
const getMonthlyStatistics = (db, user_id = 1) => {
  const year = String(new Date().getFullYear());
  return db
    .prepare(
      `SELECT strftime('%m', b.updated_at) AS month, COUNT(a.id) AS items FROM productsInLists a LEFT JOIN lists b ON a.list_id=b.list_id WHERE user_id = ? AND strftime('%Y', b.updated_at) = ? GROUP BY strftime('%m', b.updated_at)`
    )
    .all(user_id, year);
};

module.exports = {
  getTopCategories,
  getTopItems,
  getMonthlyStatistics,
};
