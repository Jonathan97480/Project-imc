import Icon from 'react-native-vector-icons/FontAwesome'
import React from 'react'
import { View, Text, StyleSheet } from 'react-native'

interface PopinInterface {
  title: string
  children: React.ReactNode
  open: boolean
  close: () => void
}

const Popin = (props: PopinInterface) => {
  const { title, children, open } = props

  if (!open) {
    return null
  }
  return (
    <View style={[styles.contenaire, { width: '100%', position: 'absolute', zIndex: 100 }]}>
      <View
        style={{
          width: '100%',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 30,
        }}>
        <View style={{ width: 10, backgroundColor: 'red' }}></View>
        <Text style={[styles.label, { paddingBottom: 0 }]}>{title}</Text>
        <View
          style={{ backgroundColor: 'red', padding: 4, borderRadius: 5 }}
          onTouchEnd={() => {
            props.close()
          }}>
          <Icon name="close" size={20} color="#fff" />
        </View>
      </View>
      {children}
    </View>
  )
}

const styles = StyleSheet.create({
  contenaire: {
    backgroundColor: '#191E34',
    padding: 16,
    borderRadius: 5,
    width: '100%',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    top: '30%',
  },

  label: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingBottom: 30,
  },
})

export default Popin
