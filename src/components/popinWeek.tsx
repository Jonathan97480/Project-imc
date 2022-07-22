import React from 'react'
import { View, Text } from 'react-native'
import RNPickerSelect, { PickerStyle } from 'react-native-picker-select'
import { custom } from '../interfaces'
import globalStyles from '../styles/global'
import Logic from '../util/logic'
import ButtonComponent from './Button'
import Popin from './popin'

interface DialProps {
  data: custom.Days[]
  onValidate: (week: number, month: number) => void
  close: () => void
  open: boolean
}

const PopinWeek = (props: DialProps) => {
  const { onValidate, open, data } = props
  const weeks = Logic.getAllDays(data)
  const months = Logic.getAllMonths(data)
  const [fitre, setFitre] = React.useState<{ week: number; mount: number }>({
    week: 0,
    mount: 0,
  })
  const onChangeWeek = (value: string) => {
    setFitre({ ...fitre, week: Number(value) })
  }
  const onChangeMount = (value: string) => {
    setFitre({ ...fitre, mount: Number(value) })
  }

  return (
    <Popin title="Semaine" open={open} close={props.close}>
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
            if (fitre.mount !== 0 && fitre.week !== 0) {
              onValidate(fitre.week, fitre.mount)
              return
            }
            alert('Veuillez sélectionner une semaine et un mois')
          }}>
          <Text style={globalStyles.btnText}>Valider</Text>
        </ButtonComponent>
      </View>
    </Popin>
  )
}
export default PopinWeek

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
