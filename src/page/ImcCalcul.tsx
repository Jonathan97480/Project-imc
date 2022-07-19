import React, { useEffect, useState } from 'react'
import { View, Text, TextInput } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { SQLiteDatabase } from 'react-native-sqlite-storage'
import { ButtonComponent, PopinCalculImc, VuMeterComponent } from '../components/'
import { UserProfile } from '../interfaces'
import globalStyles from '../styles/global'

interface ImcProps {
  profile: UserProfile | null

  db: SQLiteDatabase
  updateHistorique: (val) => void
}

const date = {
  day: new Date().getDate(),
  month: new Date().getMonth() + 1,
  year: new Date().getFullYear(),
}
const ImcCalcul = (props: ImcProps) => {
  const { profile, db } = props
  const [imc, setImc] = React.useState(0)
  const [poids, setPoids] = React.useState(0)
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
      /* Check user is value exit for today */
      checkEnterExistFordate(db, profile.id).then(_result => {
        if (!_result.user) {
          const newImc = calculImc(profile, poids)
          insertImc(profile, poids, newImc, db).then(() => {
            setPoids(0)
            setImc(newImc)
            props.updateHistorique(profile)
          })
        } else {
          setShowPopin({ active: true, idEntry: _result.user.id })
        }
      })
    } else {
      throw new Error('Veuillez renseigner votre votre poids')
    }
  }

  return (
    <SafeAreaView style={globalStyles.safeArea}>
      <View style={globalStyles.container}>
        <Text
          style={[
            globalStyles.textColorPrimary,
            globalStyles.textSize24,
            globalStyles.textBold,
            globalStyles.textCenter,
          ]}>
          Calculer votre imc
        </Text>
        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
          <VuMeterComponent percent={imc / 100} />
        </View>

        {showPopin.active && (
          <PopinCalculImc
            onCancel={() => {
              setShowPopin({ active: false, idEntry: 0 })
            }}
            onValidate={() => {
              if (profile) {
                const newImc = calculImc(profile, poids)

                updateImc(showPopin.idEntry, poids, newImc, db)
                  .then(() => {
                    setPoids(0)
                    setImc(newImc)
                    setShowPopin({ active: false, idEntry: 0 })
                    props.updateHistorique(profile)
                  })
                  .catch(error => {
                    throw new Error(error)
                  })
              }
            }}
          />
        )}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            marginBottom: 40,
          }}>
          <Text
            style={[
              {
                marginRight: 35,
              },
              globalStyles.textColorPrimary,
              globalStyles.textSize16,
              globalStyles.textLight,
            ]}>
            Votre poids
          </Text>
          <TextInput
            style={[
              { backgroundColor: '#191E34', width: 50, height: 43, marginRight: 10 },
              globalStyles.textColorPrimary,
              globalStyles.textSize16,
              globalStyles.textBold,
              globalStyles.textCenter,
            ]}
            placeholder="Poids"
            keyboardType="numeric"
            onChange={e => handlePoids(e)}
            value={poids.toString()}
          />
          <Text
            style={[
              globalStyles.textColorPrimary,
              globalStyles.textSize16,
              globalStyles.textBold,
              globalStyles.textCenter,
            ]}>
            Kg
          </Text>
        </View>

        <ButtonComponent
          style={globalStyles.ButtonStyle}
          onPress={() => {
            handleImc()
          }}>
          <Text
            style={[
              globalStyles.textColorPrimary,
              globalStyles.textSize16,
              globalStyles.textBold,
              globalStyles.textCenter,
            ]}>
            Calculer
          </Text>
        </ButtonComponent>
      </View>
    </SafeAreaView>
  )
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

const calculImc = (profile: UserProfile, poids: number) => {
  const value1: number = profile?.user_size * 2
  let result: number = poids / value1

  result = Math.round(result * 100) / 100
  result = parseInt(result.toString().split('.')[1])
  console.info(result, 'result')

  return result
}
