import * as SQLite from 'expo-sqlite';
import { SECTION_LIST_MOCK_DATA } from './utils';

const db = SQLite.openDatabase('little_lemon');

export async function createTable() {
  return new Promise((resolve, reject) => {
    db.transaction(
      (tx) => {
        tx.executeSql(
          'create table if not exists menuitems (id integer primary key not null, uuid text, title text, price text, category text);'
        );
      },
      reject,
      resolve
    );
  });
}

export async function getMenuItems() {
  return new Promise((resolve) => {
    db.transaction((tx) => {
      tx.executeSql('select * from menuitems', [], (_, { rows }) => {
        resolve(rows._array);
      });
    });
  });
}

export function saveMenuItems(menuItems) {
  db.transaction((tx) => {
    const sql = `
      INSERT INTO menuitems (uuid, title, price, category)
      VALUES
    `;

    const values = menuItems.map(
      (item) =>
        `("${item.id}", "${item.title}", "${item.price}", "${item.category}")`
    );

    tx.executeSql(sql + values.join(','));
  });
}

export async function filterByQueryAndCategories(query, activeCategories) {
  return new Promise((resolve, reject) => {
    let queryParts = [];
    let values = [];

    if (query && query.trim().length > 0) {
      queryParts.push("(title LIKE ?)");
      values.push(`%${query}%`);
    }

    if (activeCategories && activeCategories.length > 0) {
      let categoryPlaceholders = activeCategories.map(() => "?").join(",");
      queryParts.push(`(category IN (${categoryPlaceholders}))`);
      values = values.concat(activeCategories);
    }

    let sql = "SELECT * FROM menuitems";
    if (queryParts.length > 0) {
      sql += " WHERE " + queryParts.join(" AND ");
    }

    db.transaction((tx) => {
      tx.executeSql(sql, values, (_, { rows }) => {
        resolve(rows._array);
      });
    }, reject, resolve);
  });
}
