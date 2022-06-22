import React, { useState } from 'react'
import { View, Text, Image, Pressable, TextInput, TextInputChangeEventData } from 'react-native'
import { SQLiteDatabase } from 'react-native-sqlite-storage'
import { ButtonComponent, ProfileComponent, VuMeterComponent } from '../components/'
import { UserProfile } from '../interfaces'

interface ImcProps {
  profile: UserProfile | null
  navigation: any
  db: SQLiteDatabase
}

const ImcCalcul = (props: ImcProps) => {
  const { navigation, profile, db } = props
  const [imc, setImc] = React.useState(0)
  const [poids, setPoids] = React.useState(0)
  const [details, setDetails] = React.useState(false)

  const insertImc = async () => {
    const curentDate = new Date()
    await db.transaction(tx => {
      tx.executeSql(
        'INSERT INTO imc (user_id, user_name, user_poids, user_imc, imc_date) VALUES (?,?,?,?,?)',
        [
          profile?.id,
          profile?.user_name,
          poids.toString(),
          imc.toString(),
          curentDate.toDateString(),
        ],
      )
    })
  }
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

      insertImc()

      setImc(result)
      setPoids(0)
      setDetails(true)
      return
    }

    throw new Error('Veuillez renseigner votre votre poids')
  }

  if (!details) {
    return (
      <View>
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
