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
      user_poids_start: 0,
      user_poids_end: 0,
      user_imc_start: 0,
      user_imc_end: 0,
      user_avatar: undefined,
      user_img_end: 0,
      user_img_start: 0,
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
  _profileUser: UserProfile,
  _db: SQLiteDatabase,
  _day: number,
  _month: number,
  _year: number,
) {
  const _newPoids = Math.floor(Math.random() * (110 - 200 + 1)) + 200
  const _result = Logic.calculImc(_profileUser, _newPoids)
  if (isNaN(_result.imc)) {
    _result.imc = 0
  }
  if (isNaN(_result.img)) {
    _result.img = 0
  }
  let newDay = _day.toString()
  if (newDay.length === 1) {
    newDay = '0' + newDay
  }
  let newMonth = _month.toString()
  if (newMonth.length === 1) {
    newMonth = '0' + newMonth
  }
  const date = `${_year}/${newMonth}/${newDay}`
  return new Promise((_resolve, _reject) => {
    _db.transaction(tx => {
      tx.executeSql(
        'INSERT INTO imc (user_id, user_name, user_poids, user_imc, user_img, imc_date) VALUES (?,?,?,?,?,?)',
        [_profileUser.id, _profileUser.user_name, _newPoids, _result.imc, _result.img, date],
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
    generateDateForThreeYears(user, max, _db)
  })
}

function generateDateForThreeYears(user: UserProfile, max: number, db: SQLiteDatabase) {
  gYear(2022, user, db, max)
}

function gYear(year: number, user: UserProfile, db: SQLiteDatabase, max) {
  if (max > 0) {
    gMonth(0, year, user, db, max)
  }
}

function gMonth(month: number, y: number, user: UserProfile, db: SQLiteDatabase, max) {
  if (month == 12) {
    gYear(y - 1, user, db, max - 1)
  } else {
    gDay(0, month, y, user, db, max)
  }
}

function gDay(day: number, m: number, y: number, user: UserProfile, db, max) {
  if (day === 31) {
    gMonth(m + 1, y, user, db, max)
  }

  createEntries(user, db, day, m, y).then(result => {
    if (day < 31) {
      gDay(day + 1, m, y, user, db, max)
    }
  })
}

export default populateDataBase
