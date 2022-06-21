/* SqlLite data base */
import { openDatabase, ResultSet, SQLiteDatabase } from 'react-native-sqlite-storage';



async function dbInit(): Promise<SQLiteDatabase> {
  return await openDatabase({
    name: "rn_sqlite",
    location: "default",
  });

}
async function get(db, table, id) {
  db.transation(tx => {
    tx.executeSql(
      `SELECT * FROM ${table} WHERE id=?`,
      [id],
      (tx, results) => {
        console.log("Query success");
        return results.rows.item(0);
      },
      error => console.log(error),
    );
  });
}

async function getAll(db, table) {
  db.transation(tx => {
    tx.executeSql(
      `SELECT * FROM ${table}`,
      [],
      (tx, results) => {
        console.log("Query success", results.rows.item(0));
        return results.rows;
      },
      error => console.log(error),
    );
  });
}

async function insert(db, table, data) {
  /* serialize data */
  let values = Object.values(data);
  let keys = Object.keys(data);
  let sql = `INSERT INTO ${table} (${keys.join(",")}) VALUES (${values.join(",")
    })`;

  console.log(sql);
  db.transation(tx => {
    tx.executeSql(
      sql
    ).then(results => {
      console.log("Query success INSERT");
      return results.rows.item(0);
    });
  });
}

async function update(db, table, data, id) {
  db.transation(tx => {
    tx.executeSql(
      `UPDATE ${table} SET ${Object.keys(data)
        .map(key => `${key}=?`)
        .join(",")
      } WHERE id =? `,
      Object.values(data).concat(id),
      (tx, results) => {
        console.log("Query success");
        return results.rows.item(0);
      },
      error => console.log(error),
    );
  });
}

async function deleteEnter(db, table, id) {
  db.transation(tx => {
    tx.executeSql(
      `DELETE FROM ${table} WHERE id =? `,
      [id],
      (tx, results) => {
        console.log("Query success");
        return results.rows.item(0);
      },
      error => console.log(error),
    );
  });
}

async function deleteAll(db, table) {
  db.transation(tx => {
    tx.executeSql(
      `DELETE FROM ${table} `,
      [],
      (tx, results) => {
        console.log("Query success");
        return results.rows.item(0);
      },
      error => console.log(error),
    );
  });
}

async function drop(db, table) {
  db.transation(tx => {
    tx.executeSql(
      `DROP TABLE ${table} `,
      [],
      (tx, results) => {
        console.log("Query success");
        return results.rows.item(0);
      },
      error => console.log(error),
    );
  });
}

/**
 *
 * @param {string} table
 * @param {Array} columns
 */
function createTable(db: SQLiteDatabase, table: string, columns: string[], callBack: (result: ResultSet) => void) {
  db.transaction(tx => {
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS ${table} (${columns.join(" , ")})`,
      [],
      (tx, results) => {

        callBack(results);
      },
      (error) => {
        throw new Error(error.toString());
      },
    );
  });

}


export { dbInit, get, getAll, insert, update, deleteEnter, deleteAll, drop, createTable };