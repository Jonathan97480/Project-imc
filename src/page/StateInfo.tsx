import React, { useEffect } from 'react'
import { View, Text } from 'react-native'
import { UserProfile } from '../interfaces'
import { SQLiteDatabase } from 'react-native-sqlite-storage'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Avatar, ButtonComponent, Chart } from '../components'
import globalStyles from '../styles/global'

interface ImcProps {
  profile: UserProfile | null

  db: SQLiteDatabase
  updateHistorique: (val) => void
  historique: { date: string | Date; poids: number; imc: number }[] | null
}

const StateInfo = (props: ImcProps) => {
  const { profile, historique } = props
  const [data2, setData2] = React.useState<any[]>(historique ? historique : [])
  useEffect(() => {
    if (historique) {
      setData2(historique)
    }
  }, [historique])
  /* TODO: a remplacer par un écrant ou un component */
  if (data2 === null || data2.length <= 0) return <Text>Acune donée disponible pour le moment</Text>
  const days = getDays(data2)
  const poids = returnPoids(data2)
  const imc = returnImc(data2)
  const labels = getLabelByDay(days)

  return (
    <SafeAreaView style={globalStyles.safeArea}>
      <View>
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
          <ButtonComponent style={globalStyles.btnSmall} onPress={() => { }}>
            <Text style={globalStyles.btnText}>Semaine</Text>
          </ButtonComponent>
          <ButtonComponent style={globalStyles.btnSmall} onPress={() => { }}>
            <Text style={globalStyles.btnText}>Mois</Text>
          </ButtonComponent>
          <ButtonComponent style={globalStyles.btnSmall} onPress={() => { }}>
            <Text style={globalStyles.btnText}>Année</Text>
          </ButtonComponent>
        </View>
        {labels.length > 0 && <Chart imc={imc} poids={poids} labels={labels} />}
      </View>
    </SafeAreaView>
  )
}

export default StateInfo

const returnDate = (date: any[]) => {
  const newDate: Date[] = []

  date.forEach(element => {
    const date = new Date(element.date)
    newDate.push(date)
  })

  return newDate
}
const returnImc = (date: any[]) => {
  const newImc: number[] = []

  date.forEach(element => {
    newImc.push(element.imc)
  })

  return newImc
}
const returnPoids = (date: any[]) => {
  const newPoids: number[] = []

  date.forEach(element => {
    newPoids.push(element.poids)
  })

  return newPoids
}

const getDays = (data: any[]): Days[] => {
  const newDays: Days[] = []

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

interface Days {
  day: string
  month: string
  year: number
}
const getLabelByDay = (data: Days[]) => {
  const newLabel: string[] = []

  data.forEach(element => {
    newLabel.push(element.day)
  })

  return newLabel
}
