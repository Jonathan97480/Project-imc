import React from 'react'
import { View, Text, Pressable, ViewStyle, StyleSheet } from 'react-native'

interface PopinCalculImc {
  onValidate: () => void
  onCancel: () => void
}

const PopinCalculImc = (props: PopinCalculImc) => {
  const { onValidate, onCancel } = props

  return (
    <View style={[styles.contenaire, { position: 'absolute', zIndex: 100 }]}>
      <Text style={styles.label}>Atention</Text>
      <Text style={styles.paragraphe}>
        Relancez un nouveau calcul ecrasera les donées que vous avez déja entrée aujourd’hui
      </Text>

      <View style={styles.btnContenaire}>
        <View style={styles.btnBlock}>
          <Pressable style={[styles.btn, styles.btnColorValide]} onPress={onValidate}>
            <Text style={styles.btnText}>Validée</Text>
          </Pressable>
          <Pressable style={[styles.btn, styles.btnColorAnnule]} onPress={onCancel}>
            <Text style={styles.btnText}>Annulée</Text>
          </Pressable>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  contenaire: {
    backgroundColor: '#191E34',
    padding: 16,
    borderRadius: 5,
  },
  btn: {
    padding: 15,
    borderRadius: 5,
  },
  btnColorValide: {
    backgroundColor: '#193427',
  },
  btnColorAnnule: {
    backgroundColor: '#EA3030',
  },
  btnBlock: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  label: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingBottom: 40,
  },
  paragraphe: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '300',
  },
  btnContenaire: {},
  btnText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
})

export default PopinCalculImc
