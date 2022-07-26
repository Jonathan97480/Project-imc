import React from 'react'
import { View, Text } from 'react-native'
import RNPickerSelect, { PickerStyle } from 'react-native-picker-select'
import { custom } from '../interfaces'
import globalStyles from '../styles/global'
import Logic from '../util/logic'
import ButtonComponent from './Button'
import PopIn from './popIn'

interface DialProps {
  onChangeYear: (value: string) => void
  data: custom.Days[]
  close: () => void
  open: boolean
}

const PopInYear = (props: DialProps) => {
  const { onChangeYear, open, data } = props
  const years = Logic.getAllYears(data)
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
