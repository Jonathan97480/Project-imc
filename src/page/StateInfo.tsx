import React, { useEffect, useState } from 'react'
import { View, Text, StatusBar } from 'react-native'
import { custom, UserProfile } from '../interfaces'
import { SQLiteDatabase } from 'react-native-sqlite-storage'
import { SafeAreaView } from 'react-native-safe-area-context'
import Icon from 'react-native-vector-icons/FontAwesome'

import {
  Avatar,
  ButtonComponent,
  Chart,
  CustomTable,
  InfoImg,
  PopInMonth,
  PopInWeek,
  PopInYear,
} from '../components'
import globalStyles from '../styles/global'
import Logic from '../util/logic'
import { ScrollView } from 'react-native-virtualized-view'

interface ImcProps {
  profile: UserProfile | null

  db: SQLiteDatabase
  updateHistorique: (val) => void
  historique: { date: string; poids: number; imc: number; img: number }[] | null
  navigation: any
}

const StateInfo = (props: ImcProps) => {
  const { profile, historique } = props
  console.log(historique, 'historique')
  const [data2, setData2] = React.useState<custom.dataBaseImcTable[]>(historique ? historique : [])
  useEffect(() => {
    if (historique) {
      setData2(historique)
    }
  }, [historique])
  if (data2 === null || data2.length <= 0) return <NoData {...props} />

  const days = Logic.getDays(data2)
  const [poids, setPoids] = useState(Logic.returnPoids(data2))
  const [imc, setImc] = useState(Logic.returnImc(data2))
  const [img, setImg] = useState(Logic.returnImg(data2))

  const [labels, setLabels] = useState<string[]>(Logic.getLabelByDay(days))

  const [showPopInWeek, setShowPopInWeek] = React.useState(false)
  const [showPopInMonth, setShowPopInMonth] = React.useState(false)
  const [showPopInYear, setShowPopInYear] = React.useState(false)
  const [date, setDate] = React.useState<string[] | undefined>(Logic.getDate(data2))
  console.info(img, 'IMG CHECK')
  const handleWeek = (data: custom.dataBaseImcTable[]) => {
    setShowPopInWeek(false)
    setPoids(Logic.returnPoids(data))
    setImc(Logic.returnImc(data))
    setLabels(Logic.getLabelByDay(Logic.getDays(data)))
    const newDate = Logic.getDate(data)
    setDate(newDate)
  }

  const handleMonth = (data: {
    poids: number[]
    imc: number[]
    label: string[]
    date: string[]
  }) => {
    setShowPopInMonth(false)

    setPoids(data.poids)
    setImc(data.imc)
    setLabels(data.label)
    setDate(data.date)
  }

  const handleYear = (data: { poids: number[]; imc: number[]; label: string[] }) => {
    setShowPopInYear(false)
    setPoids(data.poids)
    setImc(data.imc)
    setLabels(data.label)
    setDate(undefined)
  }

  return (
    <SafeAreaView style={globalStyles.safeArea}>
      <StatusBar backgroundColor={'#1C2137'} />
      <ScrollView style={{ position: 'relative' }}>
        <View style={[{ justifyContent: 'center', alignItems: 'center' }, globalStyles.gap40]}>
          <Avatar profile={profile} />
        </View>
        <Text style={[globalStyles.title, globalStyles.gap40]}>{profile?.user_name}</Text>
        <InfoImg db={props.db} idUSer={profile?.id} />
        <Text style={[globalStyles.paragraphe, globalStyles.gap40]}>
          Votre courbe de perte de poids
        </Text>
        <View
          style={[
            { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
            globalStyles.gap40,
          ]}>
          <ButtonComponent
            style={globalStyles.btnSmall}
            onPress={() => {
              setShowPopInWeek(true)
            }}>
            <Text style={globalStyles.btnText}>Semaine</Text>
          </ButtonComponent>
          <ButtonComponent
            style={globalStyles.btnSmall}
            onPress={() => {
              setShowPopInMonth(true)
            }}>
            <Text style={globalStyles.btnText}>Mois</Text>
          </ButtonComponent>
          <ButtonComponent
            style={globalStyles.btnSmall}
            onPress={() => {
              setShowPopInYear(true)
            }}>
            <Text style={globalStyles.btnText}>Année</Text>
          </ButtonComponent>
        </View>
        <PopInWeek
          open={showPopInWeek}
          db={props.db}
          idUser={profile ? profile?.id : 0}
          close={() => {
            setShowPopInWeek(false)
          }}
          onValidate={(data: custom.dataBaseImcTable[]) => {
            handleWeek(data)
          }}
        />
        <PopInMonth
          open={showPopInMonth}
          idUser={profile ? profile?.id : 0}
          db={props.db}
          close={() => {
            setShowPopInMonth(false)
          }}
          onValidate={data => {
            handleMonth(data)
          }}
        />
        <PopInYear
          db={props.db}
          idUser={profile ? profile?.id : 0}
          open={showPopInYear}
          close={() => {
            setShowPopInYear(false)
          }}
          onValidate={value => {
            handleYear(value)
          }}
        />
        {labels.length > 0 && <Chart imc={imc} poids={poids} labels={labels} />}

        <CustomTable
          data={{
            poids: poids,
            imc: imc,
            date: date,
            img: img,
            label: labels,
          }}
        />
      </ScrollView>
    </SafeAreaView>
  )
}

const NoData = (props: any) => {
  return (
    <SafeAreaView
      style={[
        globalStyles.safeArea,
        { height: '100%', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' },
      ]}>
      <StatusBar backgroundColor={'#1C2137'} />

      <View
        style={{
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Icon name="bar-chart" size={100} color="#fff" style={globalStyles.gap20} />
        <Text style={[globalStyles.paragraphe, globalStyles.gap20]}>
          Aucune donnée disponible veuillez faire le calcul de votre imc pour avoir vos premiere
          donnée
        </Text>
        <ButtonComponent
          style={globalStyles.ButtonStyle}
          onPress={() => props.navigation.navigate('IMC CALCUL')}>
          <Text style={[globalStyles.btnText, { width: 300 }]}>Calculer</Text>
        </ButtonComponent>
      </View>
    </SafeAreaView>
  )
}

export default StateInfo
