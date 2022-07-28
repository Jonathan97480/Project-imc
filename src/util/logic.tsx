import { SQLiteDatabase } from 'react-native-sqlite-storage'
import { custom, UserProfile } from '../interfaces'

class Logic {
  /* Logique */
  static deleteUserInfo = async (
    _id: number,
    _db: SQLiteDatabase,
  ): Promise<UserProfile[] | void> => {
    return new Promise((_resolve, _reject) => {
      _db.transaction(ty => {
        ty.executeSql(
          'DELETE FROM profile WHERE id =? ',
          [_id],

          () => {
            console.info('USER AND INFO USER DELETE')
          },
          error => {
            throw new Error(error.toString())
          },
        )
      })
      try {
        _db.transaction(ty => {
          ty.executeSql(
            'DELETE FROM imc WHERE id =? ',
            [_id],
            () => {
              Logic.getAllProfile(_db).then((listProfile: UserProfile[]) => {
                _resolve(listProfile)
              })
            },
            error => {
              throw new Error(error.toString())
            },
          )
        })
      } catch (error) {
        _reject(error)
        console.error(error)
      }
    })
  }

  static getAllProfile = async (_db: SQLiteDatabase): Promise<UserProfile[]> => {
    return new Promise((_resolve, _reject) => {
      _db.transaction(_tx => {
        _tx.executeSql(
          'SELECT * FROM profile',
          [],
          (_tx, _results) => {
            const profile: UserProfile[] = []
            for (let index = 0; index < _results.rows.length; index++) {
              const element: UserProfile = _results.rows.item(index)
              profile.push(element)
            }

            _resolve(profile)
          },
          error => _reject(error),
        )
      })
    })
  }

  static createNewProfile = (): UserProfile => {
    const newProfile = {
      id: 0,
      user_name: '',
      user_sexe: '',
      user_age: 0,
      user_size: 0,
      user_avatar: '',
    }

    return newProfile
  }
  static insertImc = async (
    _profile: UserProfile,
    _poids: number,
    _imc: number,
    _date: {
      day: number
      month: number
      year: number
    },
    _db: SQLiteDatabase,
  ) => {
    new Promise((_resolve, _reject) => {
      try {
        _db.transaction(tx => {
          tx.executeSql(
            'INSERT INTO imc (user_id, user_name, user_poids, user_imc, imc_date) VALUES (?,?,?,?,?)',
            [
              _profile?.id,
              _profile?.user_name,
              _poids.toString(),
              _imc.toString(),
              `${_date.year + '/' + _date.month + '/' + _date.day}`,
            ],
            (tx, result) => {
              _resolve(result)
            },
            error => {
              _reject(error)
            },
          )
        })
      } catch (error) {
        throw new Error(error)
      }
    })
  }
  static updateImc = async (
    _idEntry: number,
    _poids: number,
    _imc: number,
    _db: SQLiteDatabase,
  ) => {
    return await new Promise((_resolve, _reject) => {
      _db.transaction(_ty => {
        _ty.executeSql(
          `UPDATE imc SET user_poids=? , user_imc=? WHERE id=${_idEntry} `,
          [_poids, _imc],
          (ty, _result) => {
            _resolve(_result)
          },
          error => {
            _reject(error)
          },
        )
      })
    })
  }
  static calculImc = (profile: UserProfile, poids: number) => {
    const value1: number = profile?.user_size * 2
    let result: number = poids / value1

    result = Math.round(result * 100) / 100
    result = parseInt(result.toString().split('.')[1])
    /*  console.info(result, 'result') */

    return result
  }
  static checkEnterExistForDate = async (
    _db: SQLiteDatabase,
    _idUser: number,
    _date: {
      day: number
      month: number
      year: number
    },
  ): Promise<{ user?: UserProfile | null; error?: string | null }> => {
    return await new Promise((_resolve, _reject) => {
      _db.transaction(_ty => {
        _ty.executeSql(
          `SELECT * FROM imc WHERE imc_date =? AND user_id =? `,
          [`${_date.year + '/' + _date.month + '/' + _date.day}`, _idUser],
          (_tx, _result) => {
            if (_result.rows.item.length > 0) {
              for (let index = 0; index < _result.rows.item.length; index++) {
                const element: UserProfile = _result.rows.item(index)

                _resolve({ user: element })
              }
            } else {
              _resolve({
                error: 'No entry',
              })
            }
          },
          _error => {
            _reject(_error)
          },
        )
      })
    })
  }

  static returnDate = (date: any[]) => {
    const newDate: Date[] = []

    date.forEach(element => {
      const date = new Date(element.date)
      newDate.push(date)
    })

    return newDate
  }
  static returnImc = (date: custom.dataBaseImcTable[]) => {
    const newImc: number[] = []

    date.forEach(element => {
      newImc.push(element.imc)
    })

    return newImc
  }
  static returnPoids = (date: custom.dataBaseImcTable[]) => {
    const newPoids: number[] = []

    date.forEach(element => {
      newPoids.push(element.poids)
    })

    return newPoids
  }

  static getDays = (
    data: custom.dataBaseImcTable[] | null,
    date?: string[] | null,
  ): custom.Days[] => {
    const newDays: custom.Days[] = []
    if (data === null && date === null) {
      return newDays
    }

    const days = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam']
    const months = [
      'Janvier',
      'Février',
      'Mars',
      'Avril',
      'Mai',
      'Juin',
      'Juillet',
      'Août',
      'Septembre',
      'Octobre',
      'Novembre',
      'Décembre',
    ]
    if (data) {
      for (let i = 0; i < data.length; i++) {
        const d: string[] = data[i].date.split('/')
        const newDate: { day: string; month: string; year: string } = {
          day: d[2],
          month: d[1],
          year: d[0],
        }
        if (newDate.day === '0') {
          continue
        }
        if (newDate.month.length === 1) {
          newDate.month = '0' + newDate.month
        }
        if (newDate.day.length === 1) {
          newDate.day = '0' + newDate.day
        }

        const newFinalDate: Date = new Date(`${newDate.year}/${newDate.month}/${newDate.day}`)
        const day = days[newFinalDate.getDay()]
        const month = months[newFinalDate.getMonth()]
        const year = newFinalDate.getFullYear()

        newDays.push({ day, month, year, newFinalDate })
      }
    }
    if (date) {
      for (let i = 0; i < date.length; i++) {
        const d: string[] = date[i].split('/')
        const newDate: { day: string; month: string; year: string } = {
          day: d[2],
          month: d[1],
          year: d[0],
        }

        if (newDate.day === '0' || newDate.day === '00') {
          continue
        }
        if (newDate.month.length === 1) {
          newDate.month = '0' + newDate.month
        }
        if (newDate.day.length === 1) {
          newDate.day = '0' + newDate.day
        }

        const newFinalDate: Date = new Date(`${newDate.year}/${newDate.month}/${newDate.day}`)
        const day = days[newFinalDate.getDay()]
        const month = months[newFinalDate.getMonth()]
        const year = newFinalDate.getFullYear()

        newDays.push({ day, month, year, newFinalDate })
      }
    }
    return newDays
  }
  static getLabelByDay = (data: custom.Days[]) => {
    const newLabel: string[] = []

    data.forEach(element => {
      element.newFinalDate
      newLabel.push(element.day + ' ' + element.newFinalDate.getDate())
    })

    return newLabel
  }
  static getAllYears = (data: custom.Days[]) => {
    const newYears: number[] = []

    data.forEach(element => {
      if (!newYears.includes(element.year)) {
        newYears.push(element.year)
      }
    })

    return newYears
  }
  static getAllMonths = (data: custom.Days[]) => {
    const newMonths: string[] = []

    data.forEach(element => {
      if (!newMonths.includes(element.month)) {
        newMonths.push(element.month)
      }
    })

    return newMonths
  }
  static getAllDays = (data: custom.Days[]) => {
    const newDays: {
      week1: string[]
      week2: string[]
      week3: string[]
      week4: string[]
      week5: string[]
    } = {
      week1: [],
      week2: [],
      week3: [],
      week4: [],
      week5: [],
    }

    data.forEach(element => {
      const curentDay = element.newFinalDate.getDate()
      if (curentDay <= 7) {
        newDays.week1.push(element.day)
      } else if (curentDay <= 14) {
        newDays.week2.push(element.day)
      } else if (curentDay <= 21) {
        newDays.week3.push(element.day)
      } else if (curentDay <= 28) {
        newDays.week4.push(element.day)
      } else if (curentDay <= 31) {
        newDays.week5.push(element.day)
      }
    })

    return newDays
  }

  static getDataForCurrentYear = async (
    db: SQLiteDatabase,
    idUser: number,
  ): Promise<custom.dataBaseImcTable[]> => {
    const curentDate = new Date()
    const currentDay = curentDate.getDate()
    const currentMonth = curentDate.getMonth() + 1
    const currentYear = curentDate.getFullYear()
    let stringMonth = currentMonth.toString()
    let stringDay = currentDay.toString()
    if (currentMonth.toString().length === 1) {
      stringMonth = '0' + currentMonth.toString()
    }
    if (currentDay.toString().length === 1) {
      stringDay = '0' + currentDay.toString()
    }
    const dateIntervalle = {
      end: `${currentYear}/${stringMonth}/${stringDay}`,
      start: `${currentYear}/01/01`,
    }

    return await new Promise((_resolve, _reject) => {
      db.transaction(tx => {
        tx.executeSql(
          `SELECT * FROM imc WHERE imc_date BETWEEN  '${dateIntervalle.start}'  AND  '${dateIntervalle.end}' AND user_id = ${idUser} ORDER BY imc_date ASC`,
          [],
          (tx, _result) => {
            const data: custom.dataBaseImcTable[] = []
            for (let index = 0; index < _result.rows.length; index++) {
              const element = _result.rows.item(index)
              data.push({
                date: element.imc_date,
                poids: element.user_poids,
                imc: element.user_imc,
              })
            }

            _resolve(data)
          },
          error => {
            _reject(error)
          },
        )
      })
    })
  }

  static getAllDateForCurrentYear = (data: custom.Days[]) => {
    const newDate: custom.Days[] = []

    data.forEach(element => {
      if (element.year === new Date().getFullYear()) {
        newDate.push(element)
      }
    })

    return newDate
  }

  static filterDataByYear = (data: custom.dataBaseImcTable[], year: number) => {
    const newData: custom.dataBaseImcTable[] = []

    data.forEach(element => {
      if (element.date.split('/')[2] === year.toString()) {
        newData.push(element)
      }
    })

    return newData
  }
  static filterDataByMonthAndYear = (
    data: custom.dataBaseImcTable[],
    month: number,
    year: number,
  ) => {
    const newData: custom.dataBaseImcTable[] = []

    data.forEach(element => {
      if (
        element.date.split('/')[1] === month.toString() &&
        element.date.split('/')[2] === year.toString()
      ) {
        newData.push(element)
      }
    })

    return newData
  }
  static filterDataByWeekAndCurrentYear = (
    data: custom.dataBaseImcTable[],
    week: number,
    month: number,
  ) => {
    const newData: custom.dataBaseImcTable[] = []
    const currentYear = new Date().getFullYear()
    let newWeek = 0

    if (week === 1) {
      newWeek = 7
    }
    if (week === 2) {
      newWeek = 14
    }
    if (week === 3) {
      newWeek = 21
    }
    if (week === 4) {
      newWeek = 28
    }
    if (week === 5) {
      newWeek = 31
    }

    for (let index = 0; index < data.length; index++) {
      const element: custom.dataBaseImcTable = data[index]
      const elementDate: string[] = element.date.split('/')

      if (
        elementDate[2] === currentYear.toString() &&
        parseInt(elementDate[0]) >= 1 &&
        parseInt(elementDate[1]) === month &&
        parseInt(elementDate[0]) <= 7 &&
        parseInt(elementDate[1]) === month
      ) {
        if (Logic.getDayByDateString(element.date) === 'Dimanche') {
          /*  newData.push(element) */
          break
        }
        newData.push(element)
      }
    }

    return newData
  }
  static getNumberMonth = (month: string) => {
    switch (month) {
      case 'Janvier':
        return 1
      case 'Février':
        return 2
      case 'Mars':
        return 3
      case 'Avril':
        return 4
      case 'Mai':
        return 5
      case 'Juin':
        return 6
      case 'Juillet':
        return 7
      case 'Août':
        return 8
      case 'Septembre':
        return 9
      case 'Octobre':
        return 10
      case 'Novembre':
        return 11
      case 'Décembre':
        return 12
      default:
        return 0
    }
  }
  static getDayByDateString(date: string) {
    const days = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi']
    const d = date.split('/')
    const newDate: Date = new Date(`${d[0]}/${d[1]}/${d[2]}`)
    const day = days[newDate.getDay()]
    return day
  }

  static async getAllDateForDataBase(db: SQLiteDatabase, idUser: number): Promise<string[]> {
    return await new Promise((_resolve, _reject) => {
      db.transaction(tx => {
        tx.executeSql(
          `SELECT imc_date FROM imc WHERE user_id = ${idUser} ORDER BY imc_date ASC`,
          [],
          (tx, _result) => {
            const data: string[] = []
            for (let index = 0; index < _result.rows.length; index++) {
              const element = _result.rows.item(index)

              data.push(element.imc_date)
            }

            _resolve(data)
          },
          error => {
            _reject(error)
          },
        )
      })
    })
  }

  static getDate(data: custom.dataBaseImcTable[]) {
    const ListDate: string[] = []

    data.forEach(element => {
      const arrayDate = element.date.split('/')
      const year = arrayDate[0]
      const month = arrayDate[1]
      const day = arrayDate[2]

      ListDate.push(`${day}/${month}/${year}`)
    })
    return ListDate
  }
}

export default Logic
