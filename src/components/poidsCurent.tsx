import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import globalStyles from '../styles/global'

const PoidsCurent = (props: { poids: number }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Votre poids Actuelle</Text>
      <Text style={styles.value}>{props.poids} Kg</Text>
    </View>
  )
}

export default PoidsCurent

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
    fontSize: 15,
    fontWeight: 'bold',
  },
  value: {
    color: '#fff',
    fontSize: 40,
    fontWeight: 'bold',
  },
})
