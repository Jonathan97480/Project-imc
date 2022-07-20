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
              `${_date.day + '/' + _date.month + '/' + _date.year}`,
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
          (ty, _resutl) => {
            _resolve(_resutl)
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
    console.info(result, 'result')

    return result
  }
  static checkEnterExistFordate = async (
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
          [`${_date.day + '/' + _date.month + '/' + _date.year}`, _idUser],
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
  static returnImc = (date: any[]) => {
    const newImc: number[] = []

    date.forEach(element => {
      newImc.push(element.imc)
    })

    return newImc
  }
  static returnPoids = (date: any[]) => {
    const newPoids: number[] = []

    date.forEach(element => {
      newPoids.push(element.poids)
    })

    return newPoids
  }

  static getDays = (data: any[]): custom.Days[] => {
    const newDays: custom.Days[] = []

    const days = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche']
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

    for (let i = 0; i < data.length; i++) {
      const d: string = data[i].date.split('/')
      const newDate: Date = new Date(`${d[2]}/${d[1]}/${d[0]}`)
      const day = days[newDate.getDay()]
      const month = months[newDate.getMonth()]
      const year = newDate.getFullYear()

      newDays.push({ day, month, year })
    }

    return newDays
  }
  static getLabelByDay = (data: custom.Days[]) => {
    const newLabel: string[] = []

    data.forEach(element => {
      newLabel.push(element.day)
    })

    return newLabel
  }
}

export default Logic