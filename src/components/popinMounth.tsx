import React from 'react'
import { View, Text } from 'react-native'
import RNPickerSelect, { PickerStyle } from 'react-native-picker-select'
import globalStyles from '../styles/global'
import ButtonComponent from './Button'
import Popin from './popin'

interface DialProps {
  onChangeYear: (value: string) => void
  onChangeMounth: (value: string) => void
  close: () => void
  open: boolean
}

const PopinMounth = (props: DialProps) => {
  const { onChangeMounth, onChangeYear, open } = props
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
            items={[
              { label: 'Janvier', value: '1' },
              { label: 'Fevrier', value: '2' },
              { label: 'Mars', value: '3' },
              { label: 'Avril', value: '4' },
            ]}
            onValueChange={value => {
              onChangeMounth(value)
            }}
          />
          <RNPickerSelect
            placeholder={{ label: 'Sélectionnez Anée' }}
            style={styleInput}
            items={[
              { label: '2019', value: '1' },
              { label: '2020', value: '2' },
              { label: '2021', value: '3' },
              { label: '2022', value: '4' },
            ]}
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
