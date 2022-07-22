import React, { useEffect, useState } from 'react'
import { View, Text } from 'react-native'
import { custom, UserProfile } from '../interfaces'
import { SQLiteDatabase } from 'react-native-sqlite-storage'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Avatar, ButtonComponent, Chart, PopinMounth, PopinWeek, PopinYear } from '../components'
import globalStyles from '../styles/global'
import Logic from '../util/logic'
import { panHandlerName } from 'react-native-gesture-handler/lib/typescript/handlers/PanGestureHandler'

interface ImcProps {
  profile: UserProfile | null

  db: SQLiteDatabase
  updateHistorique: (val) => void
  historique: { date: string; poids: number; imc: number }[] | null
}

const StateInfo = (props: ImcProps) => {
  const { profile, historique } = props
  const [data2, setData2] = React.useState<custom.dataBaseImcTable[]>(historique ? historique : [])
  useEffect(() => {
    if (historique) {
      setData2(historique)
    }
  }, [historique])
  /* TODO: a remplacer par un écrant ou un component */
  if (data2 === null || data2.length <= 0) return <Text>Acune donée disponible pour le moment</Text>
  const days = Logic.getDays(data2)
  const [poids, setPoids] = useState(Logic.returnPoids(data2))
  const [imc, setImc] = useState(Logic.returnImc(data2))
  const [labels, setLabels] = useState(Logic.getLabelByDay(days))

  const [showPopinWeek, setShowPopinWeek] = React.useState(false)
  const [showPopinMounth, setShowPopinMounth] = React.useState(false)
  const [showPopinYear, setShowPopinYear] = React.useState(false)

  const handleWeek = (week: number, month: number) => {
    setShowPopinWeek(false)
    const newData = Logic.filterDataByWeekAndCurrentYear(data2, week, month)

    setPoids(Logic.returnPoids(newData))
    setImc(Logic.returnImc(newData))
    setLabels(Logic.getLabelByDay(Logic.getDays(newData)))
    console.log(labels)
  }

  const handleMounth = (year: number, month: number) => {
    setShowPopinMounth(false)
    const newData = Logic.filterDataByMonthAndYear(data2, year, month)

    setPoids(Logic.returnPoids(newData))
    setImc(Logic.returnImc(newData))
    setLabels(Logic.getLabelByDay(Logic.getDays(newData)))
  }

  const handleYear = (year: number) => {
    setShowPopinYear(false)
    const newData = Logic.filterDataByYear(data2, year)

    setPoids(Logic.returnPoids(newData))
    setImc(Logic.returnImc(newData))
    setLabels(Logic.getLabelByDay(Logic.getDays(newData)))
  }

  return (
    <SafeAreaView style={globalStyles.safeArea}>
      <View style={{ position: 'relative' }}>
        <View style={[{ justifyContent: 'center', alignItems: 'center' }, globalStyles.gap40]}>
          <Avatar profile={profile} />
        </View>
        <Text style={[globalStyles.title, globalStyles.gap40]}>{profile?.user_name}</Text>
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
              setShowPopinWeek(true)
            }}>
            <Text style={globalStyles.btnText}>Semaine</Text>
          </ButtonComponent>
          <ButtonComponent
            style={globalStyles.btnSmall}
            onPress={() => {
              setShowPopinMounth(true)
            }}>
            <Text style={globalStyles.btnText}>Mois</Text>
          </ButtonComponent>
          <ButtonComponent
            style={globalStyles.btnSmall}
            onPress={() => {
              setShowPopinYear(true)
            }}>
            <Text style={globalStyles.btnText}>Année</Text>
          </ButtonComponent>
        </View>
        <PopinWeek
          data={Logic.getAllDateForCurrentYear(days)}
          open={showPopinWeek}
          close={() => {
            setShowPopinWeek(false)
          }}
          onValidate={(week: number, month: number) => {
            handleWeek(week, month)
          }}
        />
        <PopinMounth
          data={days}
          open={showPopinMounth}
          close={() => {
            setShowPopinMounth(false)
          }}
          onChangeMounth={(value: string) => {
            console.log(value)
          }}
          onChangeYear={(value: string) => {
            console.log(value)
          }}
        />
        <PopinYear
          data={days}
          open={showPopinYear}
          close={() => {
            setShowPopinYear(false)
          }}
          onChangeYear={(value: string) => {
            console.log(value)
          }}
        />
        {labels.length > 0 && <Chart imc={imc} poids={poids} labels={labels} />}
      </View>
    </SafeAreaView>
  )
}

export default StateInfo
