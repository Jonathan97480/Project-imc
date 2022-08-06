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
    initPopIn(data)
    return () => {
      setYears([])
    }
  }, [data])

  const initPopIn = data => {
    setYears(Logic.getAllYears(data))
  }

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
            getDataYear(selectedYear, db, idUser)
              .then(data => {
                props.onValidate(getMoyenMonths(data))
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

function getMoyenMonths(data: custom.dataBaseImcTable[]): {
  poids: number[]
  imc: number[]
  img: number[]
  label: string[]
} {
  const months: {
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
      months.month1.push(element)
    }
    if (month === 2) {
      months.month2.push(element)
    }
    if (month === 3) {
      months.month3.push(element)
    }
    if (month === 4) {
      months.month4.push(element)
    }
    if (month === 5) {
      months.month5.push(element)
    }
    if (month === 6) {
      months.month6.push(element)
    }
    if (month === 7) {
      months.month7.push(element)
    }
    if (month === 8) {
      months.month8.push(element)
    }
    if (month === 9) {
      months.month9.push(element)
    }
    if (month === 10) {
      months.month10.push(element)
    }
    if (month === 11) {
      months.month11.push(element)
    }
    if (month === 12) {
      months.month12.push(element)
    }
  })
  const newData: {
    poids: number[]
    imc: number[]
    img: number[]
    label: string[]
  } = {
    poids: [],
    imc: [],
    img: [],
    label: [],
  }
  if (months.month1.length > 0) {
    const month1Moyen = calculMoyen(months.month1)
    newData.poids.push(month1Moyen.poids)
    newData.imc.push(month1Moyen.imc)
    newData.img.push(month1Moyen.img)
    newData.label.push('Janvier')
  }
  if (months.month2.length > 0) {
    const month2Moyen = calculMoyen(months.month2)
    newData.poids.push(month2Moyen.poids)
    newData.imc.push(month2Moyen.imc)
    newData.img.push(month2Moyen.img)
    newData.label.push('Février')
  }

  if (months.month3.length > 0) {
    const month3Moyen = calculMoyen(months.month3)
    newData.poids.push(month3Moyen.poids)
    newData.imc.push(month3Moyen.imc)
    newData.img.push(month3Moyen.img)
    newData.label.push('Mars')
  }

  if (months.month4.length > 0) {
    const month4Moyen = calculMoyen(months.month4)
    newData.poids.push(month4Moyen.poids)
    newData.imc.push(month4Moyen.imc)
    newData.img.push(month4Moyen.img)
    newData.label.push('Avril')
  }

  if (months.month5.length > 0) {
    const month5Moyen = calculMoyen(months.month5)
    newData.poids.push(month5Moyen.poids)
    newData.imc.push(month5Moyen.imc)
    newData.img.push(month5Moyen.img)
    newData.label.push('Mai')
  }

  if (months.month6.length > 0) {
    const month6Moyen = calculMoyen(months.month6)
    newData.poids.push(month6Moyen.poids)
    newData.imc.push(month6Moyen.imc)
    newData.img.push(month6Moyen.img)
    newData.label.push('Juin')
  }

  if (months.month7.length > 0) {
    const month7Moyen = calculMoyen(months.month7)
    newData.poids.push(month7Moyen.poids)
    newData.imc.push(month7Moyen.imc)
    newData.img.push(month7Moyen.img)
    newData.label.push('Juillet')
  }

  if (months.month8.length > 0) {
    const month8Moyen = calculMoyen(months.month8)
    newData.poids.push(month8Moyen.poids)
    newData.imc.push(month8Moyen.imc)
    newData.img.push(month8Moyen.img)
    newData.label.push('Août')
  }

  if (months.month9.length > 0) {
    const month9Moyen = calculMoyen(months.month9)
    newData.poids.push(month9Moyen.poids)
    newData.imc.push(month9Moyen.imc)
    newData.img.push(month9Moyen.img)
    newData.label.push('Septembre')
  }

  if (months.month10.length > 0) {
    const month10Moyen = calculMoyen(months.month10)
    newData.poids.push(month10Moyen.poids)
    newData.imc.push(month10Moyen.imc)
    newData.img.push(month10Moyen.img)
    newData.label.push('Octobre')
  }

  if (months.month11.length > 0) {
    const month11Moyen = calculMoyen(months.month11)
    newData.poids.push(month11Moyen.poids)
    newData.imc.push(month11Moyen.imc)
    newData.img.push(month11Moyen.img)
    newData.label.push('Novembre')
  }

  if (months.month12.length > 0) {
    const month12Moyen = calculMoyen(months.month12)
    newData.poids.push(month12Moyen.poids)
    newData.imc.push(month12Moyen.imc)
    newData.img.push(month12Moyen.img)
    newData.label.push('Décembre')
  }

  return newData
}

function calculMoyen(data: custom.dataBaseImcTable[]): { poids: number; imc: number; img: number } {
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
