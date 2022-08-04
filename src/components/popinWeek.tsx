import React, { useEffect } from 'react'
import { View, Text } from 'react-native'
import RNPickerSelect, { PickerStyle } from 'react-native-picker-select'
import { SQLiteDatabase } from 'react-native-sqlite-storage'
import { custom } from '../interfaces'
import globalStyles from '../styles/global'
import Logic from '../util/logic'
import ButtonComponent from './Button'
import PopIn from './popIn'

interface DialProps {
  onValidate: (data: custom.dataBaseImcTable[]) => void
  close: () => void
  open: boolean
  db: SQLiteDatabase
  idUser: number
}

const PopInWeek = (props: DialProps) => {
  const { onValidate, open } = props
  const [data, setData] = React.useState<custom.Days[]>([])
  const [weeks, setWeeks] = React.useState(Logic.getAllDays(data))
  const [months, setMonths] = React.useState<string[]>(Logic.getAllMonths(data))
  const [filter, setFilter] = React.useState<{ week: number; mount: number }>({
    week: 0,
    mount: 0,
  })
  const onChangeWeek = (value: string) => {
    setFilter({ ...filter, week: Number(value) })
  }
  const onChangeMount = (value: string) => {
    setFilter({ ...filter, mount: Number(value) })
  }

  useEffect(() => {
    Logic.getDataForCurrentYear(props.db, props.idUser).then(data => {
      const newDate = Logic.getDays(data)
      /* const newData = Logic.getAllDateForCurrentYear(newDate) */
      setData(newDate)
      setWeeks(Logic.getAllDays(newDate))
      setMonths(Logic.getAllMonths(newDate))
    })
  }, [])

  return (
    <PopIn title="Semaine" open={open} close={props.close}>
      <View style={{ width: '90%' }}>
        <View>
          <Text style={[globalStyles.gap30, globalStyles.paragraphe]}>
            Sélectionnez votre semaine
          </Text>
          <RNPickerSelect
            placeholder={{ label: 'Sélectionnez semaine' }}
            style={styleInput}
            items={returnWeeksOptions(weeks)}
            onValueChange={value => {
              onChangeWeek(value)
            }}
          />
          <RNPickerSelect
            placeholder={{ label: 'Sélectionnez  mois' }}
            style={styleInput}
            items={returnMonthsOptions(months)}
            onValueChange={value => {
              onChangeMount(value)
            }}
          />
        </View>
        <ButtonComponent
          style={[globalStyles.ButtonStyle, { backgroundColor: '#193427' }]}
          onPress={() => {
            if (filter.mount !== 0 && filter.week !== 0) {
              /*  onValidate(filter.week, filter.mount) */
              ApplyAFilter(filter.week, filter.mount, props.db, props.idUser).then(
                (result: custom.dataBaseImcTable[]) => {
                  onValidate(result)
                },
              )
              return
            }
            alert('Veuillez sélectionner une semaine et un mois')
          }}>
          <Text style={globalStyles.btnText}>Valider</Text>
        </ButtonComponent>
      </View>
    </PopIn>
  )
}
export default PopInWeek

function returnWeeksOptions(data: {
  week1: string[]
  week2: string[]
  week3: string[]
  week4: string[]
  week5: string[]
}) {
  const weeks: { label: string; value: string }[] = []

  if (data.week1.length > 0) {
    weeks.push({ label: 'Semaine 1', value: '1' })
  }
  if (data.week2.length > 0) {
    weeks.push({ label: 'Semaine 2', value: '2' })
  }
  if (data.week3.length > 0) {
    weeks.push({ label: 'Semaine 3', value: '3' })
  }
  if (data.week4.length > 0) {
    weeks.push({ label: 'Semaine 4', value: '4' })
  }
  if (data.week5.length > 0) {
    weeks.push({ label: 'Semaine 5', value: '5' })
  }

  return weeks
}

function returnMonthsOptions(data: string[]) {
  const months: { label: string; value: string }[] = []

  data.forEach(month => {
    months.push({ label: month, value: Logic.getNumberMonth(month).toString() })
  })

  return months
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

/* Logic préparation requête Data Base */

/* créé une fonction que on va appeler quand on valide le filtre  */
async function ApplyAFilter(
  week: number,
  month: number,
  db: SQLiteDatabase,
  idUser: number,
): Promise<custom.dataBaseImcTable[]> {
  const curentYear = new Date().getFullYear()

  const firstDayWeek = GetFirstDayWeek(week, month, curentYear)

  let lastDayWeek: string = (parseInt(firstDayWeek) + 6).toString()
  if (lastDayWeek.length === 1) {
    lastDayWeek = `0${lastDayWeek}`
  }
  if (parseInt(lastDayWeek) >= 31) {
    lastDayWeek = '31'
  }
  let monthString = month.toString()
  if (monthString.length == 1) {
    monthString = `0${month}`
  }
  const weekDate = {
    start: `${curentYear}/${monthString}/${firstDayWeek}`,
    end: `${curentYear}/${monthString}/${lastDayWeek}`,
  }

  /* run request data base  */
  const result = await GetDateDataBase(weekDate, db, idUser)
  return result
}

function GetFirstDayWeek(week: number, month: number, curentYear: number): string {
  const firstDayMonth = new Date(`${curentYear}/${month}/01`).getDay()

  let firstDayWeek = week * 7 + 1

  if (firstDayMonth !== 1) {
    firstDayWeek -= firstDayMonth - 1
  }
  firstDayWeek = firstDayWeek - 7
  const l: string = firstDayWeek.toString()

  if (l.length === 1) {
    return `0${firstDayWeek} `
  }

  return l
}

async function GetDateDataBase(
  weekDate: { start: string; end: string },
  db: SQLiteDatabase,
  idUser: number,
): Promise<custom.dataBaseImcTable[]> {
  return await new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        `SELECT * FROM imc WHERE imc_date BETWEEN  '${weekDate.start}'  AND  '${weekDate.end}' AND user_id = ${idUser} ORDER BY imc_date ASC`,
        [],
        (tx, _result) => {
          const data: custom.dataBaseImcTable[] = []
          /* console.warn(weekDate, 'weekDate') */
          for (let index = 0; index < _result.rows.length; index++) {
            const element = _result.rows.item(index)
            /*  console.log(element, 'weekDate') */
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
