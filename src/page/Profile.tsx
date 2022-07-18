import React from 'react'
import { View, Text, Image, ImageStyle, StyleSheet, ViewStyle } from 'react-native'
import { ButtonComponent } from '../components/'
import { UserProfile } from '../interfaces'
import { SQLiteDatabase } from 'react-native-sqlite-storage'
import { SafeAreaView } from 'react-native-safe-area-context'
import globalStyles from '../styles/global'

interface ProfileProps {
  profile: UserProfile | null
  navigation: any
  db: SQLiteDatabase
}

const Profile = (props: ProfileProps) => {
  const { navigation, profile } = props

  return (
    <SafeAreaView style={globalStyles.safeArea}>
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
          <View style={[styles.containtInfo, globalStyles.gap40]}>
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
          {/*  <View style={[styles.containtInfo, globalStyles.gap40,]}>
            <Text  style={[
                globalStyles.textColorPrimary,
                globalStyles.textSize16,
                globalStyles.textLight,
              ]}>Votre poids</Text>
            <Text  style={[globalStyles.textColorPrimary, { fontSize: 20 }, globalStyles.textBold]}>{profile?.us}</Text>
          </View> */}
          <View style={styles.containtInfo}>
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
  avatar: ImageStyle
  containtInfo: ViewStyle
}

const styles = StyleSheet.create<styleInterface>({
  avatar: {
    width: 87,
    height: 87,
    borderRadius: 87 / 2,
  },
  containtInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
})

export default Profile
{
  /* <View>
      <View>
        <Text>Taille</Text>
        <Text>{profile?.user_size}</Text>
      </View>

      <View>
        <Text>Age</Text>
        <Text>{profile?.user_age}</Text>
      </View>

      <ButtonComponent
        onPress={() => {
          navigation.navigate('IMC CALCUL', {
            screen: 'Feed',
            params: {
              sort: 'latest',
            },
          })
        }}>
        IMC CALCUL
      </ButtonComponent>

      <ButtonComponent
        onPress={() => {
          navigation.navigate('Home', {
            screen: 'Feed',
            params: {
              sort: 'latest',
            },
          })
        }}>
        REVENIR A LA LIST DES PROFILE
      </ButtonComponent>
    </View> */
}
