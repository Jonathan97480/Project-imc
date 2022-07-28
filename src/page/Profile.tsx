import React from 'react'
import { View, Text, StyleSheet, ViewStyle, StatusBar } from 'react-native'
import { Avatar, ButtonComponent } from '../components/'
import { UserProfile } from '../interfaces'
import { SQLiteDatabase } from 'react-native-sqlite-storage'
import { SafeAreaView } from 'react-native-safe-area-context'
import globalStyles from '../styles/global'

interface ProfileProps {
  updateHistorique(profile: UserProfile | null)
  profile: UserProfile | null
  navigation: any
  db: SQLiteDatabase
}

const Profile = (props: ProfileProps) => {
  const { navigation, profile } = props

  return (
    <SafeAreaView style={globalStyles.safeArea}>
      <StatusBar backgroundColor={'#1C2137'} />

      <View style={[globalStyles.container]}>
        <Text
          style={[
            globalStyles.textColorPrimary,
            globalStyles.textBold,
            globalStyles.textSize24,
            globalStyles.textCenter,
            globalStyles.gap40,
          ]}>
          Votre profil
        </Text>
        <View style={[{ justifyContent: 'center', alignItems: 'center' }, globalStyles.gap40]}>
          <Avatar profile={profile} />
        </View>
        <Text
          style={[
            globalStyles.textColorPrimary,
            globalStyles.textBold,
            globalStyles.textCenter,
            globalStyles.gap40,
            { fontSize: 20 },
          ]}>
          {profile?.user_name}
        </Text>
        <View style={globalStyles.gap40}>
          <View style={[styles.containerInfo, globalStyles.gap40]}>
            <Text
              style={[
                globalStyles.textColorPrimary,
                globalStyles.textSize16,
                globalStyles.textLight,
              ]}>
              Votre taille
            </Text>
            <Text style={[globalStyles.textColorPrimary, { fontSize: 20 }, globalStyles.textBold]}>
              {profile?.user_size} cm
            </Text>
          </View>
          {/*  <View style={[styles.containerInfo, globalStyles.gap40,]}>
            <Text  style={[
                globalStyles.textColorPrimary,
                globalStyles.textSize16,
                globalStyles.textLight,
              ]}>Votre poids</Text>
            <Text  style={[globalStyles.textColorPrimary, { fontSize: 20 }, globalStyles.textBold]}>{profile?.us}</Text>
          </View> */}
          <View style={styles.containerInfo}>
            <Text
              style={[
                globalStyles.textColorPrimary,
                globalStyles.textSize16,
                globalStyles.textLight,
              ]}>
              Votre age
            </Text>
            <Text style={[globalStyles.textColorPrimary, { fontSize: 20 }, globalStyles.textBold]}>
              {profile?.user_age} ans
            </Text>
          </View>
        </View>
        <ButtonComponent
          style={globalStyles.ButtonStyle}
          onPress={() => {
            navigation.navigate('Add Profile')
          }}>
          <Text
            style={[
              globalStyles.textColorPrimary,
              globalStyles.textSize16,
              globalStyles.textBold,
              globalStyles.textCenter,
            ]}>
            Modifier
          </Text>
        </ButtonComponent>
      </View>
    </SafeAreaView>
  )
}

interface styleInterface {
  containerInfo: ViewStyle
}

const styles = StyleSheet.create<styleInterface>({
  containerInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
})

export default Profile
