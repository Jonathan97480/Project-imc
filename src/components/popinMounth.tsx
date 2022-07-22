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
  onChangeYear: (value: string) => void
  onChangeMounth: (value: string) => void
  close: () => void
  open: boolean
}

const PopinMounth = (props: DialProps) => {
  const { onChangeMounth, onChangeYear, open, data } = props
  const months = Logic.getAllMonths(data)
  const years = Logic.getAllYears(data)

  return (
    <Popin title="Mois" open={open} close={props.close}>
      <View style={{ width: '90%' }}>
        <View>
          <Text style={[globalStyles.gap30, globalStyles.paragraphe]}>
            Sélectionnez votre Mois est l&apos;anée
          </Text>

          <RNPickerSelect
            placeholder={{ label: 'Sélectionnez  mois' }}
            style={styleInput}
            items={returnMonthsOptions(months)}
            onValueChange={value => {
              onChangeMounth(value)
            }}
          />
          <RNPickerSelect
            placeholder={{ label: 'Sélectionnez Anée' }}
            style={styleInput}
            items={returnYearsOptions(years)}
            onValueChange={value => {
              onChangeYear(value)
            }}
          />
        </View>
        <ButtonComponent
          style={[globalStyles.ButtonStyle, { backgroundColor: '#193427' }]}
          onPress={() => {
            console.log('ok')
          }}>
          <Text style={globalStyles.btnText}>Valider</Text>
        </ButtonComponent>
      </View>
    </Popin>
  )
}
export default PopinMounth

function returnMonthsOptions(data: string[]) {
  const months: { label: string; value: string }[] = []

  data.forEach(month => {
    months.push({ label: month, value: month })
  })

  return months
}

function returnYearsOptions(data: number[]) {
  const years: { label: string; value: string }[] = []

  data.forEach(year => {
    years.push({ label: year.toString(), value: year.toString() })
  })

  return years
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
