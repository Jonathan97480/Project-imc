import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import globalStyles from '../styles/global'

const ResultImc = (props: { imc: number }) => {
  if (props.imc === 0) {
    return null
  }
  return (
    <View style={styles.container}>
      <View style={styles.ligne}>
        <Text style={[styles.title, { fontWeight: 'bold' }]}>IMC</Text>
        <Text style={[styles.title, { fontWeight: 'bold' }]}>Interpretations</Text>
      </View>
      <View style={[styles.ligne, { backgroundColor: '#fd9827', padding: 6, borderRadius: 5 }]}>
        <Text style={styles.title}>Inférieure 18.5</Text>
        <Text style={styles.title}>Insuffisance pondérale</Text>
      </View>
      <View style={[styles.ligne, { backgroundColor: '#0e9616', padding: 6, borderRadius: 5 }]}>
        <Text style={styles.title}>18.5 a 25</Text>
        <Text style={styles.title}>Corpulence normal</Text>
      </View>
      <View style={[styles.ligne, { backgroundColor: '#db3811', padding: 6, borderRadius: 5 }]}>
        <Text style={styles.title}>supérieure a 25</Text>
        <Text style={styles.title}>Obésité</Text>
      </View>
    </View>
  )
}

export default ResultImc

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#191E34',
    marginTop: 30,
    borderRadius: 5,
    padding: 10,
  },
  ligne: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  title: {
    width: '50%',
    textAlign: 'center',
    color: '#fff',
    fontSize: 15,
  },
  value: {},
})
