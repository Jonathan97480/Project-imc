import React from 'react'
import { View, Text } from 'react-native'
import RNPickerSelect, { PickerStyle } from 'react-native-picker-select'
import globalStyles from '../styles/global'
import ButtonComponent from './Button'
import Popin from './popin'

interface DialProps {
  onChangeWeek: (value: string) => void
  onChangeMounth: (value: string) => void
  close: () => void
  open: boolean
}

const PopinWeek = (props: DialProps) => {
  const { onChangeMounth, onChangeWeek, open } = props
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
            items={[
              { label: 'Semaine 1', value: '1' },
              { label: 'Semaine 2', value: '2' },
              { label: 'Semaine 3', value: '3' },
              { label: 'Semaine 4', value: '4' },
            ]}
            onValueChange={value => {
              onChangeWeek(value)
            }}
          />
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
export default PopinWeek

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
