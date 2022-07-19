import React from 'react'
import { Image, StyleSheet, ImageStyle } from 'react-native'
import { UserProfile } from '../interfaces'

interface AvatarProps {
  profile: UserProfile | null
}
const Avatar = (props: AvatarProps) => {
  const { profile } = props
  return (
    <>
      {profile?.user_avatar === '' ? (
        <Image
          style={styles.avatar}
          source={
            profile.user_sexe === 'Femme'
              ? require('../assets/img/avatar_femme.png')
              : require('../assets/img/avatar_homme.png')
          }
        />
      ) : (
        <Image
          source={{
            uri: profile?.user_avatar,
          }}
        />
      )}
    </>
  )
}
export default Avatar

interface styleInterface {
  avatar: ImageStyle
}

const styles = StyleSheet.create<styleInterface>({
  avatar: {
    width: 87,
    height: 87,
    borderRadius: 87 / 2,
  },
})
