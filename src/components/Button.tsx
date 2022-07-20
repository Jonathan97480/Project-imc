import React from 'react'
import { View, Pressable, ViewStyle } from 'react-native'

interface ButtonProps {
  style?: ViewStyle | ViewStyle[]
  onPress: () => void
  children: React.ReactNode
}

const ButtonComponent = (props: ButtonProps) => {
  const { onPress, style, children } = props
  return (
    <Pressable onPress={() => onPress()}>
      <View style={style}>{children}</View>
    </Pressable>
  )
}

export default ButtonComponent
