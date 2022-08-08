import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import globalStyles from '../styles/global'

const PoidsTarget = (props: { poidsStart: number; currentPoids: number; targetPoids: number }) => {
  if (props.currentPoids === 0 || props.targetPoids === 0) {
    return null
  }
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Votre poids de départ</Text>
      <Text style={styles.value}>{props.poidsStart} Kg</Text>
      <Text style={styles.title}>poids désirée {props.targetPoids} Kg</Text>
      <Text style={styles.title}>Vous aver perdue {props.poidsStart - props.currentPoids} Kg</Text>
    </View>
  )
}

export default PoidsTarget

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#191E34',
    width: '45%',
    height: 90,
    borderColor: '#fff',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    flexDirection: 'column',
    alignItems: 'center',
    marginRight: 5,
    marginLeft: 5,
  },
  title: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  value: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
})
