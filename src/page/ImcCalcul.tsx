import React, { useState } from 'react'
import { View, Text, TextInput } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { SQLiteDatabase } from 'react-native-sqlite-storage'
import { ButtonComponent, PopinCalculImc, VuMeterComponent } from '../components/'
import { UserProfile } from '../interfaces'
import globalStyles from '../styles/global'
import Logic from '../util/logic'

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
      Logic.checkEnterExistFordate(db, profile.id, date).then(_result => {
        if (!_result.user) {
          const newImc = Logic.calculImc(profile, poids)
          Logic.insertImc(profile, poids, newImc, date, db).then(() => {
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
                const newImc = Logic.calculImc(profile, poids)

                Logic.updateImc(showPopin.idEntry, poids, newImc, db)
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
