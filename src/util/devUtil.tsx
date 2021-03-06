import { SQLiteDatabase } from 'react-native-sqlite-storage'
import { UserProfile } from '../interfaces'
import Logic from './logic'
const MAX_AGE = 80
const MIN_AGE = 15

const listNames: string[] = [
  'John',
  'Jane',
  'Paul',
  'Mary',
  'Bob',
  'Tom',
  'Jack',
  'Jill',
  'Joe',
  'Juan',
]

const listFirstNames: string[] = [
  'Dupont',
  'Hoareau',
  'Gauvin',
  'Fontaine',
  'Leroy',
  'Leroux',
  'Boyer',
  'Boucher',
  'Bourgeois',
  'Bourg',
]

async function CreateUser(db: SQLiteDatabase): Promise<UserProfile> {
  return new Promise((_resolve, _reject) => {
    const _newName = listNames[Math.floor(Math.random() * listNames.length)]
    const _newFirstName = listFirstNames[Math.floor(Math.random() * listFirstNames.length)]
    const _newAge = Math.floor(Math.random() * (MAX_AGE - MIN_AGE + 1)) + MIN_AGE
    let _newSexe = 'Homme'
    _newSexe = Math.random() > 0.5 ? 'Femme' : 'Homme'
    const _newSize = Math.floor(Math.random() * (110 - 200 + 1)) + 110
    const newUser: UserProfile = {
      id: 0,
      user_name: _newName + ' ' + _newFirstName,
      user_sexe: _newSexe,
      user_age: _newAge,
      user_size: _newSize,
      user_avatar: undefined,
    }

    db.transaction(tx => {
      tx.executeSql(
        'INSERT INTO profile (user_name, user_sexe, user_age, user_size, user_avatar) VALUES (?,?,?,?,?)',
        [
          newUser.user_name,
          newUser.user_sexe,
          newUser.user_age,
          newUser.user_size,
          newUser.user_avatar,
        ],
        (tx, results) => {
          newUser.id = results.insertId
          _resolve(newUser)
        },
        error => {
          _reject(error)
        },
      )
    })
  })
}

async function createEntries(
  _idUser: number,
  _UserName: string,
  _User_size: number,
  _db: SQLiteDatabase,
  _day: number,
  _month: number,
  _year: number,
) {
  const _newPoids = Math.floor(Math.random() * (110 - 200 + 1)) + 200
  let _newImc = Logic.calculImc(
    {
      user_size: _User_size,
      id: 0,
      user_name: '',
      user_sexe: '',
      user_age: 0,
      user_avatar: undefined,
    },
    _newPoids,
  )
  if (isNaN(_newImc)) {
    _newImc = 0
  }
  return new Promise((_resolve, _reject) => {
    _db.transaction(tx => {
      tx.executeSql(
        'INSERT INTO imc (user_id, user_name, user_poids, user_imc, imc_date) VALUES (?,?,?,?,?)',
        [
          _idUser,
          _UserName,
          _newPoids.toString(),
          _newImc.toString(),
          `${_day + '/' + _month + '/' + _year}`,
        ],
        (tx, result) => {
          _resolve(result)
        },
        error => {
          _reject(error)
        },
      )
    })
  })
}

function populateDataBase(_db: SQLiteDatabase, maxUser: number) {
  const max = maxUser

  if (max <= 0) {
    return
  }
  CreateUser(_db).then((user: UserProfile) => {
    generateDateForthreeYears(user, max - 1, _db)
  })
}

function generateDateForthreeYears(user: UserProfile, max: number, db: SQLiteDatabase) {
  gYear(2022, user, db, max)
}

function gYear(year: number, user: UserProfile, db: SQLiteDatabase, max) {
  if (year < 0) {
    populateDataBase(db, max - 1)
    return
  }
  gMonth(12, year, user, db, max)
}

function gMonth(month: number, y: number, user: UserProfile, db: SQLiteDatabase, max) {
  if (month < 0) {
    gYear(y - 1, user, db, max)
  }
  gDay(31, month, y, user, db, max)
}

function gDay(day: number, m, y, user: UserProfile, db, max) {
  if (day < 0) {
    gMonth(m - 1, y - 1, user, db, max)
  }

  createEntries(user.id, user.user_name, user.user_size, db, day, m, y).then(result => {
    gDay(day - 1, m, y, user, db, max)
  })
}

export default populateDataBase
