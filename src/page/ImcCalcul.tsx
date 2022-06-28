import React, { useState } from 'react'
import { View, Text, Image, Pressable, TextInput, TextInputChangeEventData } from 'react-native'
import { SQLiteDatabase } from 'react-native-sqlite-storage'
import { ButtonComponent, Popin, VuMeterComponent } from '../components/'
import { UserProfile } from '../interfaces'

interface ImcProps {
  profile: UserProfile | null
  navigation: any
  db: SQLiteDatabase
}

const date = {
  day: new Date().getDate(),
  month: new Date().getMonth() + 1,
  year: new Date().getFullYear(),
}
const ImcCalcul = (props: ImcProps) => {
  const { navigation, profile, db } = props
  const [imc, setImc] = React.useState(0)
  const [poids, setPoids] = React.useState(0)
  const [details, setDetails] = React.useState(false)
  const [showPopin, setShowPopin] = useState({ active: false, idEntry: 0 })

  const handlePoids = (event: any) => {
    if (event.nativeEvent.text === 'Na' || event.nativeEvent.text === '') {
      setPoids(0)
    } else {
      setPoids(parseFloat(event.nativeEvent.text))
    }
  }

  const handleImc = () => {
    if (profile?.user_size != undefined && poids != 0) {
      const value1: number = profile?.user_size * 2
      let result: number = poids / value1

      result = Math.round(result * 100) / 100
      result = parseInt(result.toString().split('.')[1])
      setImc(result)
      checkEnterExistFordate(db, profile.id).then(_result => {
        if (!_result.user) {
          insertImc(profile, poids, imc, db).then(() => {
            setPoids(0)
            setDetails(true)
          })
        } else {
          setShowPopin({ active: true, idEntry: _result.user.id })
        }
      })
    } else {
      throw new Error('Veuillez renseigner votre votre poids')
    }
  }

  if (!details) {
    return (
      <View>
        {showPopin.active && (
          <Popin
            title=""
            message="Vous avez déjà renseigné un poids pour aujourd ' hui"
            buttons={[
              {
                label: 'Remploacer la valeur',
                action: () => {
                  updateImc(showPopin.idEntry, poids, imc, db)
                    .then(() => {
                      setPoids(0)
                      setDetails(true)
                      setShowPopin({ active: false, idEntry: 0 })
                    })
                    .catch(error => {
                      throw new Error(error)
                    })
                },
                color: 'green',
              },
              {
                label: 'Cancel',
                action: () => {
                  setShowPopin({ active: false, idEntry: 0 })
                },
                color: 'red',
              },
            ]}
          />
        )}
        <Text>IMC CALCUL</Text>
        <TextInput
          placeholder="Poids"
          keyboardType="numeric"
          onChange={e => handlePoids(e)}
          value={poids.toString()}
        />
        <ButtonComponent
          title="Calculer"
          onPress={() => {
            handleImc()
          }}
          color="#00ff00"
          incon="plus"
        />
      </View>
    )
  } else {
    return (
      <View>
        <Text>IMC CALCUL</Text>

        <Text>{imc}</Text>
        <VuMeterComponent percent={imc / 100} />
        <ButtonComponent
          title="Regarder vos state"
          onPress={() => {
            setDetails(!details)
            navigation.navigate('STATE INFO')
          }}
          color="#00ff00"
          incon="plus"
        />
      </View>
    )
  }
}

export default ImcCalcul

const insertImc = async (
  _profile: UserProfile,
  _poids: number,
  _imc: number,
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
            `${date.day + '/' + date.month + '/' + date.year}`,
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

const updateImc = async (_idEntry: number, _poids: number, _imc: number, _db: SQLiteDatabase) => {
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

const checkEnterExistFordate = async (
  _db: SQLiteDatabase,
  _idUser: number,
): Promise<{ user?: UserProfile | null; error?: string | null }> => {
  return await new Promise((_resolve, _reject) => {
    _db.transaction(_ty => {
      _ty.executeSql(
        `SELECT * FROM imc WHERE imc_date =? AND user_id =? `,
        [`${date.day + '/' + date.month + '/' + date.year}`, _idUser],
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
