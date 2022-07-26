import React, { useState } from 'react'
import { View, Text, Image, PermissionsAndroid, TextInput } from 'react-native'
import { SQLiteDatabase } from 'react-native-sqlite-storage'
import { ButtonComponent } from '../components/'
import { launchCamera, launchImageLibrary } from 'react-native-image-picker'
import { UserProfile } from '../interfaces'
import { SafeAreaView } from 'react-native-safe-area-context'
import globalStyles from '../styles/global'
import Logic from '../util/logic'

interface HomeProps {
  db: SQLiteDatabase
  handleProfile: (profile: UserProfile) => void
  navigation: any
  curentProfile: UserProfile | null
}

const AddProfile = (props: HomeProps) => {
  const { db, handleProfile, navigation } = props
  const [profile, setProfile] = React.useState<UserProfile>(
    !props.curentProfile ? Logic.createNewProfile() : props.curentProfile,
  )
  const [isLoading, setIsLoading] = React.useState<boolean>(false)
  const [isScreen2, setIsScreen2] = React.useState<boolean>(profile.id <= 0 ? false : true)

  if (isLoading) {
    return <Text>Loading...</Text>
  }
  if (!isScreen2) {
    return (
      <SafeAreaView style={globalStyles.safeArea}>
        <View style={[globalStyles.container]}>
          <Text style={[globalStyles.title, globalStyles.gap40]}>Création de profil</Text>
          <Text style={[globalStyles.paragraphe, globalStyles.gap40]}>
            Veuillez choisir votre sexe{' '}
          </Text>
          <View
            style={[
              {
                justifyContent: 'space-between',
                flexDirection: 'row',
                paddingHorizontal: 40,
              },
              globalStyles.gap40,
            ]}>
            <ButtonComponent
              style={
                profile.user_sexe === 'Femme'
                  ? { backgroundColor: '#191E34', padding: 10, height: 100, borderRadius: 5 }
                  : { height: 100, padding: 10 }
              }
              onPress={() => {
                setProfile({
                  ...profile,
                  user_sexe: 'Femme',
                })
              }}>
              <Image source={require('../assets/img/womanHoldingHands.png')} />
              <Text style={[globalStyles.btnText, globalStyles.gap40]}>Femme</Text>
            </ButtonComponent>
            <ButtonComponent
              style={
                profile.user_sexe === 'Homme'
                  ? { backgroundColor: '#191E34', padding: 10, height: 100, borderRadius: 5 }
                  : { height: 100, padding: 10 }
              }
              onPress={() => {
                setProfile({
                  ...profile,
                  user_sexe: 'Homme',
                })
              }}>
              <Image source={require('../assets/img/manHoldingHands.png')} />
              <Text style={[globalStyles.btnText, globalStyles.gap40]}> Homme</Text>
            </ButtonComponent>
          </View>
          <ButtonComponent
            style={globalStyles.ButtonStyle}
            onPress={() => {
              if (profile.user_sexe != '') {
                setIsScreen2(true)
              } else {
                alert('Veuillez sélectionner votre sexe')
              }
            }}>
            <Text style={[globalStyles.btnText, globalStyles.textSize16]}>Suivant</Text>
          </ButtonComponent>
        </View>
      </SafeAreaView>
    )
  } else {
    return (
      <SafeAreaView style={[globalStyles.safeArea]}>
        <View>
          <Text style={[globalStyles.title, globalStyles.gap40]}>Éditer votre profil</Text>
          <AddAvatar profile={profile} setProfile={setProfile} />
          <View style={[globalStyles.blockInput, globalStyles.gap30]}>
            <Text style={globalStyles.blockInputLabel}>Nom</Text>
            <TextInput
              value={profile.user_name}
              style={[
                globalStyles.blockInput,
                {
                  backgroundColor: '#191E34',
                  paddingLeft: 10,
                  color: '#fff',
                },
              ]}
              onChangeText={text => {
                setProfile({
                  ...profile,
                  user_name: text,
                })
              }}
            />
          </View>
          <View style={[globalStyles.blockInput, globalStyles.gap30]}>
            <Text style={globalStyles.blockInputLabel}>Taille</Text>
            <TextInput
              value={profile.user_size.toString()}
              style={[
                globalStyles.blockInput,
                {
                  backgroundColor: '#191E34',
                  paddingLeft: 10,
                  color: '#fff',
                },
              ]}
              onChangeText={text => {
                if (isNaN(parseInt(text)) || text === '') text = '0'
                setProfile({
                  ...profile,
                  user_size: parseInt(text),
                })
              }}
              keyboardType="numeric"
            />
          </View>
          <View style={[globalStyles.blockInput, globalStyles.gap30]}>
            <Text style={globalStyles.blockInputLabel}>Age</Text>
            <TextInput
              value={profile.user_age.toString()}
              style={[
                globalStyles.blockInput,
                {
                  backgroundColor: '#191E34',
                  paddingLeft: 10,
                  color: '#fff',
                },
              ]}
              onChangeText={text => {
                if (isNaN(parseInt(text)) || text === '') text = '0'
                setProfile({
                  ...profile,
                  user_age: parseInt(text),
                })
              }}
              keyboardType="numeric"
            />
          </View>
          <ButtonComponent
            style={globalStyles.ButtonStyle}
            onPress={() => {
              if (profile.user_name === '' || profile.user_size === 0 || profile.user_age === 0) {
                alert('Veuillez remplir tous les champs')
              } else {
                try {
                  db.transaction(tx => {
                    tx.executeSql(
                      'INSERT INTO profile (user_name, user_sexe, user_age, user_size, user_avatar) VALUES (?,?,?,?,?)',
                      [
                        profile.user_name,
                        profile.user_sexe,
                        profile.user_age,
                        profile.user_size,
                        profile.user_avatar,
                      ],
                      (tx, results) => {
                        handleProfile({
                          user_name: profile.user_name,
                          user_sexe: profile.user_sexe,
                          user_age: profile.user_age,
                          user_size: profile.user_size,
                          user_avatar: profile.user_avatar,
                          id: results.insertId,
                        })

                        navigation.reset({
                          index: 0,
                          routes: [{ name: 'PROFILE' }],
                        })
                      },
                      error => {
                        throw new Error(error.toString())
                      },
                    )
                  })
                } catch (err) {
                  console.warn(err)
                }
              }
            }}>
            <Text style={[globalStyles.btnText, globalStyles.textSize16]}>Valider</Text>
          </ButtonComponent>
        </View>
      </SafeAreaView>
    )
  }
}

export default AddProfile

interface AddAvatarProps {
  profile: UserProfile
  setProfile: (val: UserProfile) => void
}

const AddAvatar = (props: AddAvatarProps) => {
  const { profile, setProfile } = props
  const [showPopIn, setShowPopIn] = useState(false)
  return (
    <View style={[{ justifyContent: 'center', alignItems: 'center' }, globalStyles.gap40]}>
      <Image source={require('../assets/img/uploadPicIcon.png')} />
      {showPopIn && (
        <PopInAddAvatar profile={profile} setProfile={setProfile} setShowPopIn={setShowPopIn} />
      )}
    </View>
  )
}

interface PopInAddAvatarProps extends AddAvatarProps {
  setShowPopIn: (val: boolean) => void
}

const PopInAddAvatar = (props: PopInAddAvatarProps) => {
  const { profile, setProfile, setShowPopIn } = props
  return (
    <View>
      <ButtonComponent
        onPress={async () => {
          try {
            const granted = await PermissionsAndroid.request(
              PermissionsAndroid.PERMISSIONS.CAMERA,
              {
                title: 'App Camera Permission',
                message: 'App needs access to your camera ',
                buttonNeutral: 'Ask Me Later',
                buttonNegative: 'Cancel',
                buttonPositive: 'OK',
              },
            )
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
              console.info('Camera permission given')
              launchCamera(
                {
                  durationLimit: 10,
                  saveToPhotos: true,
                  mediaType: 'photo',
                },
                response => {
                  if (response.didCancel) {
                    console.info('User cancelled photo picker')
                  } else if (response.errorMessage) {
                    console.info('ImagePicker Error: ', response.errorMessage)
                  } else if (response.errorCode) {
                    console.info('ImagePicker Error: ', response.errorCode)
                  } else {
                    setProfile({
                      ...profile,
                      user_avatar: response.assets ? response.assets[0].uri : '',
                    })
                  }
                },
              )
            } else {
              console.info('Camera permission denied')
            }
          } catch (err) {
            console.warn(err)
          }
        }}>
        <Text>Camera</Text>
      </ButtonComponent>
      <ButtonComponent
        onPress={async () => {
          try {
            const granted = await PermissionsAndroid.request(
              PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
              {
                title: 'App Camera Permission',
                message: 'App needs access to your camera ',
                buttonNeutral: 'Ask Me Later',
                buttonNegative: 'Cancel',
                buttonPositive: 'OK',
              },
            )
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
              console.info('Camera permission given')
              launchImageLibrary(
                {
                  mediaType: 'photo',
                },
                response => {
                  if (response.didCancel) {
                    console.info('User cancelled photo picker')
                  } else if (response.errorMessage) {
                    console.info('ImagePicker Error: ', response.errorMessage)
                  } else if (response.errorCode) {
                    console.info('ImagePicker Error: ', response.errorCode)
                  } else {
                    setProfile({
                      ...profile,
                      user_avatar: response.assets ? response.assets[0].uri : '',
                    })
                  }
                },
              )
            } else {
              console.info('Camera permission denied')
            }
          } catch (err) {
            console.warn(err)
          }
        }}>
        <Text>Galerie</Text>
      </ButtonComponent>
    </View>
  )
}
