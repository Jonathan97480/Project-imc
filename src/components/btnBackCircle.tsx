import React from 'react'
import { Pressable, Text, View } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'

const BtnBackCircle = (props: any) => {
  return (
    <Pressable
      /* style={{width}} */
      onPress={() => {
        if (props.onPress) {
          props.onPress()
        }
      }}>
      <Icon name="arrow-circle-left" style={{ fontSize: 40 }} />
    </Pressable>
  )
}

export default BtnBackCircle
