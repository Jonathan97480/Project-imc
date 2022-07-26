/* SqlLite data base */
import { openDatabase, ResultSet, SQLiteDatabase } from 'react-native-sqlite-storage'

async function dbInit(): Promise<SQLiteDatabase> {
  return await openDatabase({
    name: 'rn_sqlite',
    location: 'default',
  })
}
async function get(db, table, id) {
  db.transaction(tx => {
    tx.executeSql(
      `SELECT * FROM ${table} WHERE id=?`,
      [id],
      (tx, results) => {
        return results.rows.item(0)
      },
      error => console.error(error),
    )
  })
}

async function getAll(db, table) {
  db.transaction(tx => {
    tx.executeSql(
      `SELECT * FROM ${table}`,
      [],
      (tx, results) => {
        return results.rows
      },
      error => console.error(error),
    )
  })
}

async function insert(db, table, data) {
  /* serialize data */
  const values = Object.values(data)
  const keys = Object.keys(data)
  const sql = `INSERT INTO ${table} (${keys.join(',')}) VALUES (${values.join(',')})`

  db.transaction(tx => {
    tx.executeSql(sql).then(results => {
      console.info('Query success INSERT')
      return results.rows.item(0)
    })
  })
}

async function update(db, table, data, id) {
  db.transaction(tx => {
    tx.executeSql(
      `UPDATE ${table} SET ${Object.keys(data)
        .map(key => `${key}=?`)
        .join(',')} WHERE id =? `,
      Object.values(data).concat(id),
      (tx, results) => {
        return results.rows.item(0)
      },
      error => console.error(error),
    )
  })
}

async function deleteEnter(db, table, id) {
  db.transaction(tx => {
    tx.executeSql(
      `DELETE FROM ${table} WHERE id =? `,
      [id],
      (tx, results) => {
        return results.rows.item(0)
      },
      error => console.error(error),
    )
  })
}

async function deleteAll(db, table) {
  db.transaction(tx => {
    tx.executeSql(
      `DELETE FROM ${table} `,
      [],
      (tx, results) => {
        return results.rows.item(0)
      },
      error => console.error(error),
    )
  })
}

async function drop(db, table) {
  db.transaction(tx => {
    tx.executeSql(
      `DROP TABLE ${table} `,
      [],
      (tx, results) => {
        return results.rows.item(0)
      },
      error => console.error(error),
    )
  })
}

/**
 *
 * @param {string} table
 * @param {Array} columns
 */
function createTable(
  db: SQLiteDatabase,
  table: string,
  columns: string[],
  callBack: (result: ResultSet) => void,
) {
  db.transaction(tx => {
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS ${table} (${columns.join(' , ')})`,
      [],
      (tx, results) => {
        callBack(results)
      },
      error => {
        throw new Error(error.toString())
      },
    )
  })
}

export { dbInit, get, getAll, insert, update, deleteEnter, deleteAll, drop, createTable }
