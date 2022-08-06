import React, { useState } from 'react'
import { View, Text, TextInput, StatusBar, Image } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { SQLiteDatabase } from 'react-native-sqlite-storage'
import { ButtonComponent, PopIn, PopInCalculImc, VuMeterComponent } from '../components/'
import { UserProfile } from '../interfaces'
import globalStyles from '../styles/global'
import Logic from '../util/logic'

interface ImcProps {
  profile: UserProfile | null

  db: SQLiteDatabase
  updateHistorique: (val) => void
  navigation: any
}
const curentDate = new Date()

const date = {
  day: curentDate.getDate(),
  month: curentDate.getMonth() + 1,
  year: curentDate.getFullYear(),
}
const ImcCalcul = (props: ImcProps) => {
  const { profile, db } = props
  const [imc, setImc] = React.useState(0)
  const [poids, setPoids] = React.useState(0)
  const [showPopin, setShowPopin] = useState({ active: false, idEntry: 0 })
  const [showPopInAlert, setShowPopInAlert] = useState(false)
  const handlePoids = (event: any) => {
    if (event.nativeEvent.text === 'Na' || event.nativeEvent.text === '') {
      setPoids(0)
    } else {
      setPoids(parseInt(event.nativeEvent.text))
    }
  }

  const handleImc = () => {
    if (profile?.user_size != undefined && poids != 0) {
      /* Check user is value exit for today */
      Logic.checkEnterExistForDate(db, profile.id, date).then(_result => {
        if (!_result.user) {
          const _result: { imc: number; img: number } = Logic.calculImc(profile, poids)
          Logic.insertImc(profile, poids, _result, date, db)
            .then(() => {
              setPoids(0)
              setImc(_result.imc)
              props.updateHistorique(profile)
            })
            .catch(err => {
              console.error(err)
            })
        } else {
          setShowPopin({ active: true, idEntry: _result.user.id })
        }
      })
    } else {
      setShowPopInAlert(true)
    }
  }

  return (
    <SafeAreaView style={globalStyles.safeArea}>
      <StatusBar backgroundColor={'#1C2137'} />
      <View>
        <PopIn
          title="Poids non renseigner"
          open={showPopInAlert}
          close={() => setShowPopInAlert(false)}>
          <Text style={[globalStyles.textCenter, globalStyles.paragraphe, globalStyles.gap20]}>
            Veuillez renseigner votre votre poids pour effectuez le calcul de votre imc{' '}
          </Text>
          <ButtonComponent
            style={[
              globalStyles.gap40,
              globalStyles.ButtonStyle,
              { width: 300, backgroundColor: '#193427' },
            ]}
            onPress={() => {
              setShowPopInAlert(false)
            }}>
            <Text style={[globalStyles.btnText]}>Ok</Text>
          </ButtonComponent>
        </PopIn>
      </View>
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
          <PopInCalculImc
            onCancel={() => {
              setShowPopin({ active: false, idEntry: 0 })
            }}
            onValidate={() => {
              if (profile) {
                const _result: { imc: number; img: number } = Logic.calculImc(profile, poids)

                Logic.updateImc(showPopin.idEntry, poids, _result, db)
                  .then(() => {
                    setPoids(0)
                    setImc(_result.imc)
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
            if (imc !== 0) {
              props.navigation.navigate('STATE INFO')
            } else {
              handleImc()
            }
          }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
            <Image
              source={
                imc === 0
                  ? require('../assets/img/icon_calclBtn.png')
                  : require('../assets/img/icon_btnStat.png')
              }
              style={{ width: 20, height: 20, marginRight: 4 }}
            />
            <Text
              style={[
                globalStyles.textColorPrimary,
                globalStyles.textSize16,
                globalStyles.textBold,
                globalStyles.textCenter,
              ]}>
              {imc === 0 ? 'Calculer' : 'Voir les statistiques'}
            </Text>
          </View>
        </ButtonComponent>
      </View>
    </SafeAreaView>
  )
}

export default ImcCalcul
