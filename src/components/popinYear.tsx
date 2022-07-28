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
  onValidate: (value: { poids: number[]; imc: number[]; label: string[] }) => void
  db: SQLiteDatabase
  idUser: number
  close: () => void
  open: boolean
}

const PopInYear = (props: DialProps) => {
  const { onValidate, open, db, idUser } = props
  const [data, setData] = useState<custom.Days[]>([])
  const [years, setYears] = useState(Logic.getAllYears(data))
  const [selectedYear, setSelectedYear] = useState('')

  useEffect(() => {
    Logic.getAllDateForDataBase(db, idUser).then(data => {
      const newDate = Logic.getDays(null, data)
      setYears(Logic.getAllYears(newDate))
      setData(newDate)
    })
  }, [])

  return (
    <PopIn title="Ânées" open={open} close={props.close}>
      <View style={{ width: '90%' }}>
        <View>
          <Text style={[globalStyles.gap30, globalStyles.paragraphe]}>
            Sélectionnez l&apos;ânées
          </Text>

          <RNPickerSelect
            placeholder={{ label: 'Sélectionnez Ânées' }}
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
            getDataYear(selectedYear, db, idUser).then(data => {
              props.onValidate(getMoyenMonths(data))
            })
          }}>
          <Text style={globalStyles.btnText}>Valider</Text>
        </ButtonComponent>
      </View>
    </PopIn>
  )
}
export default PopInYear

function returnYearsOptions(data: number[]) {
  const years: { label: string; value: string }[] = []

  data.forEach(year => {
    years.push({ label: year.toString(), value: year.toString() })
  })

  return years
}

async function getDataYear(
  year: string,
  db: SQLiteDatabase,
  idUser: number,
): Promise<custom.dataBaseImcTable[]> {
  return await new Promise((resolve, reject) => {
    /* préparation des date */

    const monthInterval = {
      start: `${year}/01/01`,
      end: `${year}/12/31`,
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

function getMoyenMonths(data: custom.dataBaseImcTable[]) {
  const weeks: {
    month1: custom.dataBaseImcTable[]
    month2: custom.dataBaseImcTable[]
    month3: custom.dataBaseImcTable[]
    month4: custom.dataBaseImcTable[]
    month5: custom.dataBaseImcTable[]
    month6: custom.dataBaseImcTable[]
    month7: custom.dataBaseImcTable[]
    month8: custom.dataBaseImcTable[]
    month9: custom.dataBaseImcTable[]
    month10: custom.dataBaseImcTable[]
    month11: custom.dataBaseImcTable[]
    month12: custom.dataBaseImcTable[]
  } = {
    month1: [],
    month2: [],
    month3: [],
    month4: [],
    month5: [],
    month6: [],
    month7: [],
    month8: [],
    month9: [],
    month10: [],
    month11: [],
    month12: [],
  }
  data.forEach(element => {
    const month = parseInt(element.date.split('/')[1])
    if (month === 1) {
      weeks.month1.push(element)
    }
    if (month === 2) {
      weeks.month2.push(element)
    }
    if (month === 3) {
      weeks.month3.push(element)
    }
    if (month === 4) {
      weeks.month4.push(element)
    }
    if (month === 5) {
      weeks.month5.push(element)
    }
    if (month === 6) {
      weeks.month6.push(element)
    }
    if (month === 7) {
      weeks.month7.push(element)
    }
    if (month === 8) {
      weeks.month8.push(element)
    }
    if (month === 9) {
      weeks.month9.push(element)
    }
    if (month === 10) {
      weeks.month10.push(element)
    }
    if (month === 11) {
      weeks.month11.push(element)
    }
    if (month === 12) {
      weeks.month12.push(element)
    }
  })
  const newData: {
    poids: number[]
    imc: number[]
    label: string[]
  } = {
    poids: [],
    imc: [],
    label: [],
  }

  const month1Moyen = calculMoyen(weeks.month1)
  const month2Moyen = calculMoyen(weeks.month2)
  const month3Moyen = calculMoyen(weeks.month3)
  const month4Moyen = calculMoyen(weeks.month4)
  const month5Moyen = calculMoyen(weeks.month5)
  const month6Moyen = calculMoyen(weeks.month6)
  const month7Moyen = calculMoyen(weeks.month7)
  const month8Moyen = calculMoyen(weeks.month8)
  const month9Moyen = calculMoyen(weeks.month9)
  const month10Moyen = calculMoyen(weeks.month10)
  const month11Moyen = calculMoyen(weeks.month11)
  const month12Moyen = calculMoyen(weeks.month12)

  newData.poids.push(
    month1Moyen.poids,
    month2Moyen.poids,
    month3Moyen.poids,
    month4Moyen.poids,
    month5Moyen.poids,
    month6Moyen.poids,
    month7Moyen.poids,
    month8Moyen.poids,
    month9Moyen.poids,
    month10Moyen.poids,
    month11Moyen.poids,
    month12Moyen.poids,
  )
  newData.imc.push(
    month1Moyen.imc,
    month2Moyen.imc,
    month3Moyen.imc,
    month4Moyen.imc,
    month5Moyen.imc,
    month6Moyen.imc,
    month7Moyen.imc,
    month8Moyen.imc,
    month9Moyen.imc,
    month10Moyen.imc,
    month11Moyen.imc,
    month12Moyen.imc,
  )
  newData.label.push(
    'Jan',
    'Fév',
    'Mar',
    'Avr',
    'Mai',
    'Jui',
    'Juil',
    'Août',
    'Sept',
    'Oct',
    'Nov',
    'Déc',
  )

  return newData
}

function calculMoyen(data: custom.dataBaseImcTable[]) {
  const moyen = {
    poids: 0,
    imc: 0,
    date: '',
  }
  data.forEach(element => {
    moyen.poids += element.poids
    moyen.imc += element.imc
  })
  moyen.poids = Math.round(moyen.poids / data.length)
  moyen.imc = Math.round(moyen.imc / data.length)
  moyen.date = data[0].date

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
