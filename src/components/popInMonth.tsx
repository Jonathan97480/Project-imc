import React, { useEffect, useState } from 'react'
import { View, Text } from 'react-native'
import RNPickerSelect, { PickerStyle } from 'react-native-picker-select'
import { SQLiteDatabase } from 'react-native-sqlite-storage'
import { custom } from '../interfaces'
import globalStyles from '../styles/global'
import Logic from '../util/logic'
import ButtonComponent from './Button'
import PopIn from './popIn'

interface DialProps {
  onValidate: (val: { poids: number[]; imc: number[]; label: string[]; date: string[] }) => void
  close: () => void
  idUser: number
  db: SQLiteDatabase
  open: boolean
}

const PopInMonth = (props: DialProps) => {
  const [data, setData] = useState<custom.Days[]>([])
  const { open, idUser, db } = props
  const [months, setMonths] = useState(Logic.getAllMonths(data))
  const [years, setYears] = useState(Logic.getAllYears(data))
  const [selectedMonth, setSelectedMonth] = useState('')
  const [selectedYear, setSelectedYear] = useState('')

  if (data.length <= 0) {
    Logic.getAllDateForDataBase(db, idUser)
      .then(data => {
        setData(Logic.getDays(null, data))
      })
      .catch(err => {
        console.error(err)
      })
  }
  useEffect(() => {
    InitPopIn(data)
    return () => {
      setMonths([])
      setYears([])
    }
  }, [data])

  const InitPopIn = newDate => {
    setMonths(Logic.getAllMonths(newDate))
    setYears(Logic.getAllYears(newDate))
  }

  return (
    <PopIn title="Mois" open={open} close={props.close}>
      <View style={{ width: '90%' }}>
        <View>
          <Text style={[globalStyles.gap30, globalStyles.paragraphe]}>
            Sélectionnez votre Mois est l&apos;ânée
          </Text>

          <RNPickerSelect
            placeholder={{ label: 'Sélectionnez  mois' }}
            style={styleInput}
            items={returnMonthsOptions(months)}
            onValueChange={value => {
              setSelectedMonth(value)
            }}
          />
          <RNPickerSelect
            placeholder={{ label: 'Sélectionnez Ânée' }}
            style={styleInput}
            items={returnYearsOptions(years)}
            onValueChange={value => {
              setSelectedYear(value)
            }}
          />
        </View>
        <ButtonComponent
          style={[globalStyles.ButtonStyle, { backgroundColor: '#193427' }]}
          onPress={() => {
            getDataMonth(selectedMonth, selectedYear, db, idUser)
              .then(data => {
                props.onValidate(getMoyenWeek(data))
              })
              .catch(err => {
                console.error(err)
              })
          }}>
          <Text style={globalStyles.btnText}>Valider</Text>
        </ButtonComponent>
      </View>
    </PopIn>
  )
}
export default PopInMonth

function returnMonthsOptions(data: string[]) {
  const months: { label: string; value: string }[] = []
  for (let index = 0; index < data.length; index++) {
    const month = data[index]

    switch (month) {
      case 'Janvier':
        months.push({ label: 'Août', value: '1' })
        break
      case 'Février':
        months.push({ label: 'Septembre', value: '2' })
        break
      case 'Mars':
        months.push({ label: 'Octobre', value: '3' })
        break
      case 'Avril':
        months.push({ label: 'Novembre', value: '4' })
        break
      case 'Mai':
        months.push({ label: 'Décembre', value: '5' })
        break
      case 'Juin':
        months.push({ label: 'Janvier', value: '6' })
        break
      case 'Juillet':
        months.push({ label: 'Février', value: '7' })
        break
      case 'Août':
        months.push({ label: 'Mars', value: '8' })
        break
      case 'Septembre':
        months.push({ label: 'Avril', value: '9' })
        break
      case 'Octobre':
        months.push({ label: 'Mai', value: '10' })
        break
      case 'Novembre':
        months.push({ label: 'Juin', value: '11' })
        break
      case 'Décembre':
        months.push({ label: 'Juillet', value: '12' })
        break
      default:
        break
    }
  }

  return months
}

function returnYearsOptions(data: number[]) {
  const years: { label: string; value: string }[] = []

  data.forEach(year => {
    years.push({ label: year.toString(), value: year.toString() })
  })

  return years
}

async function getDataMonth(
  month: string,
  year: string,
  db: SQLiteDatabase,
  idUser: number,
): Promise<custom.dataBaseImcTable[]> {
  return await new Promise((resolve, reject) => {
    /* préparation des date */
    if (month.length === 1) {
      month = '0' + month
    }
    const monthInterval = {
      start: `${year}/${month}/01`,
      end: `${year}/${month}/31`,
    }

    /* récupération des données */
    db.transaction(tx => {
      tx.executeSql(
        `SELECT * FROM imc WHERE imc_date BETWEEN  '${monthInterval.start}'  AND  '${monthInterval.end}' AND user_id = ${idUser} ORDER BY imc_date ASC`,
        [],
        (tx, _results) => {
          const data: custom.dataBaseImcTable[] = []
          for (let i = 0; i < _results.rows.length; i++) {
            const element = _results.rows.item(i)
            data.push({
              date: element.imc_date,
              poids: element.user_poids,
              imc: element.user_imc,
              img: element.user_img,
            })
          }
          resolve(data)
        },
        error => {
          reject(error)
        },
      )
    })
  })
}

/* on fait la moyen des valeur pour chaque semaine */
function getMoyenWeek(data: custom.dataBaseImcTable[]) {
  const weeks: {
    week1: custom.dataBaseImcTable[]
    week2: custom.dataBaseImcTable[]
    week3: custom.dataBaseImcTable[]
    week4: custom.dataBaseImcTable[]
    week5: custom.dataBaseImcTable[]
  } = {
    week1: [],
    week2: [],
    week3: [],
    week4: [],
    week5: [],
  }

  data.forEach(element => {
    const days = parseInt(element.date.split('/')[2])

    if (days < 8) {
      weeks.week1.push(element)
    } else if (days < 15) {
      weeks.week2.push(element)
    } else if (days < 22) {
      weeks.week3.push(element)
    } else if (days < 29) {
      weeks.week4.push(element)
    } else {
      weeks.week5.push(element)
    }
  })

  const newData: {
    poids: number[]
    imc: number[]
    img: number[]
    label: string[]
    date: string[]
  } = {
    poids: [],
    imc: [],
    img: [],
    label: [],
    date: [],
  }

  if (weeks.week1.length > 0) {
    const weeks1Moyen = calculMoyen(weeks.week1)
    newData.poids.push(weeks1Moyen.poids)
    newData.imc.push(weeks1Moyen.imc)
    newData.img.push(weeks1Moyen.img)
    newData.label.push('Semaine 1')
    newData.date.push(weeks1Moyen.date)
  }
  if (weeks.week2.length > 0) {
    const weeks2Moyen = calculMoyen(weeks.week2)
    newData.poids.push(weeks2Moyen.poids)
    newData.imc.push(weeks2Moyen.imc)
    newData.img.push(weeks2Moyen.img)
    newData.label.push('Semaine 2')
    newData.date.push(weeks2Moyen.date)
  }
  if (weeks.week3.length > 0) {
    const weeks3Moyen = calculMoyen(weeks.week3)
    newData.poids.push(weeks3Moyen.poids)
    newData.imc.push(weeks3Moyen.imc)
    newData.img.push(weeks3Moyen.img)
    newData.label.push('Semaine 3')
    newData.date.push(weeks3Moyen.date)
  }
  if (weeks.week4.length > 0) {
    const weeks4Moyen = calculMoyen(weeks.week4)
    newData.poids.push(weeks4Moyen.poids)
    newData.imc.push(weeks4Moyen.imc)
    newData.img.push(weeks4Moyen.img)
    newData.label.push('Semaine 4')
    newData.date.push(weeks4Moyen.date)
  }
  if (weeks.week5.length > 0) {
    const weeks5Moyen = calculMoyen(weeks.week5)
    newData.poids.push(weeks5Moyen.poids)
    newData.imc.push(weeks5Moyen.imc)
    newData.img.push(weeks5Moyen.img)
    newData.label.push('Semaine 5')
    newData.date.push(weeks5Moyen.date)
  }

  return newData
}

function calculMoyen(data: custom.dataBaseImcTable[]) {
  const moyen = {
    poids: 0,
    imc: 0,
    img: 0,
    date: '',
  }
  data.forEach(element => {
    moyen.poids += element.poids
    moyen.imc += element.imc
    moyen.img += element.img
  })
  moyen.poids = Math.round(moyen.poids / data.length)
  moyen.imc = Math.round(moyen.imc / data.length)
  moyen.img = Math.round(moyen.img / data.length)

  if (data === null || data.length === 0 || data[0] === null) {
    console.warn(data, 'GET BIG BUG')
    moyen.date = 'undefined'
  } else {
    moyen.date = data[0].date
  }

  return moyen
}

const styleInput: PickerStyle = {
  placeholder: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    paddingTop: 10,
    paddingBottom: 10,
  },
  inputAndroid: {
    marginBottom: 20,
    fontSize: 16,
    paddingHorizontal: 20,
    paddingVertical: 10,
    width: '100%',
    height: 43,
    borderTopEndRadius: 10,
    borderBottomEndRadius: 10,

    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    color: '#ddd',
    backgroundColor: '#1D233E',
  },
}
