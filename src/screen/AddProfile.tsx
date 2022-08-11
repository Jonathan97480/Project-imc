/* eslint-disable prettier/prettier */
import React, { useState } from 'react'
import {
  View,
  Text,
  Image,
  PermissionsAndroid,
  TextInput,
  StatusBar,
  Pressable,
} from 'react-native'
import { SQLiteDatabase } from 'react-native-sqlite-storage'
import { ButtonComponent, PopIn } from '../components/'
import { launchCamera, launchImageLibrary } from 'react-native-image-picker'
import { UserProfile } from '../interfaces'
import { SafeAreaView } from 'react-native-safe-area-context'
import globalStyles from '../styles/global'
import Logic from '../util/logic'
import { center } from '@shopify/react-native-skia'

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
        <StatusBar backgroundColor={'#1C2137'} />

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
        <StatusBar backgroundColor={'#1C2137'} />

        <View>
          <Text style={[globalStyles.title, globalStyles.gap40]}>Éditer votre profil</Text>
          <AddAvatar profile={profile} setProfile={setProfile} />
          <View style={[globalStyles.blockInput, globalStyles.gap30]}>
            <View style={{ height: 20, width: '100%', flexDirection: 'row', marginBottom: 4 }}>
              <Image source={require('../assets/img/icon_user.png')} style={{ marginRight: 4 }} />
              <Text style={[globalStyles.blockInputLabel]}>Nom</Text>
            </View>

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
            <View style={{ height: 20, width: '100%', flexDirection: 'row', marginBottom: 4 }}>
              <Image
                source={require('../assets/img/icon_userSize.png')}
                style={{ marginRight: 4 }}
              />
              <Text style={globalStyles.blockInputLabel}>Taille</Text>
            </View>
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
            <View style={{ height: 20, width: '100%', flexDirection: 'row', marginBottom: 4 }}>
              <Image
                source={require('../assets/img/icon_userSize.png')}
                style={{ marginRight: 4 }}
              />
              <Text style={globalStyles.blockInputLabel}>Votre poids en Kg</Text>
            </View>
            <TextInput
              value={profile.user_poids_start.toString()}
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
                  user_poids_start: parseInt(text),
                })
              }}
              keyboardType="numeric"
            />
          </View>
          <View style={[globalStyles.blockInput, globalStyles.gap30]}>
            <View style={{ height: 20, width: '100%', flexDirection: 'row', marginBottom: 4 }}>
              <Image
                source={require('../assets/img/icon_userSize.png')}
                style={{ marginRight: 4 }}
              />
              <Text style={globalStyles.blockInputLabel}>Age</Text>
            </View>
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
              if (
                profile.user_name === '' ||
                profile.user_size === 0 ||
                profile.user_age === 0 ||
                profile.user_poids_start === 0
              ) {
                alert('Veuillez remplir tous les champs')
              } else {
                let _result: { imc: number; img: number } = { imc: 0, img: 0 }
                if (profile.user_poids_start !== 0) {
                  _result = Logic.calculImc(profile, profile.user_poids_start)
                } else {
                  alert('Veuillez entrer votre poids de départ différent de 0')
                  return
                }
                if (profile.id === null || profile.id === 0) {
                  /* calcul imc start */

                  profile.user_imc_start = _result.imc
                  profile.user_img_start = _result.img
                  profile.user_poids_end = GetPoidsIdeal(profile)

                  AddProfileDb(db, profile).then(_profile => {
                    setProfile(_profile)
                    handleProfile(_profile)
                    navigation.reset({
                      index: 0,
                      routes: [{ name: 'PROFILE' }],
                    })
                  })
                } else {

                  profile.user_imc_start = _result.imc
                  profile.user_img_start = _result.img
                  profile.user_poids_end = GetPoidsIdeal(profile)

                  UpdateProfileDb(db, profile).then(_profile => {
                    setProfile(_profile)
                    handleProfile(_profile)
                    navigation.reset({
                      index: 0,
                      routes: [{ name: 'PROFILE' }],
                    })
                  })
                }
              }
            }}>
            <Text style={[globalStyles.btnText, globalStyles.textSize16]}>
              {profile.id ? 'Mettre a jour votre profil' : 'Valider'}
            </Text>
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
      <Pressable onPress={() => setShowPopIn(true)}>
        {profile.user_avatar === '' && (
          <Image source={require('../assets/img/uploadPicIcon.png')} />
        )}
        {profile.user_avatar !== '' && (
          <Image
            style={{
              width: 87,
              height: 87,
              borderRadius: 87 / 2,
            }}
            source={{
              uri: profile?.user_avatar,
            }}
          />
        )}
      </Pressable>

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
    <PopIn title={'choisisses votre méthode'} open={true} close={() => setShowPopIn(false)}>
      <ButtonComponent
        style={[
          globalStyles.ButtonStyle,
          {
            maxWidth: 300,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-start',
          },
          globalStyles.gap10,
        ]}
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
          setShowPopIn(false)
        }}>
        <Image source={require('../assets/img/camera.png')} />

        <Text style={[globalStyles.btnText, { textAlign: 'center', width: '80%' }]}>
          Appareil photo
        </Text>
      </ButtonComponent>
      <ButtonComponent
        style={[
          globalStyles.ButtonStyle,
          { maxWidth: 300, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
          globalStyles.gap10,
        ]}
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
            console.error(err)
          }
          setShowPopIn(false)
        }}>
        <Image source={require('../assets/img/galerie.png')} />
        <Text style={[globalStyles.btnText, { textAlign: 'center', width: '80%' }]}>Galerie</Text>
      </ButtonComponent>
    </PopIn>
  )
}

async function AddProfileDb(db: SQLiteDatabase, profile: UserProfile): Promise<UserProfile> {
  return await new Promise<UserProfile>((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'INSERT INTO profile (user_name, user_sexe, user_age, user_size, user_avatar, user_poids_start, user_poids_end, user_imc_start, user_imc_end,user_img_start,user_img_end) VALUES (?,?,?,?,?,?,?,?,?,?,?)',
        [
          profile.user_name,
          profile.user_sexe,
          profile.user_age,
          profile.user_size,
          profile.user_avatar,
          profile.user_poids_start,
          profile.user_poids_end,
          profile.user_imc_start,
          profile.user_imc_end,
          profile.user_img_start,
          profile.user_img_end,
        ],
        (tx, results) => {
          resolve({
            user_name: profile.user_name,
            user_sexe: profile.user_sexe,
            user_age: profile.user_age,
            user_size: profile.user_size,
            user_avatar: profile.user_avatar,
            user_poids_start: profile.user_poids_start,
            user_poids_end: profile.user_poids_end,
            user_imc_start: profile.user_imc_start,
            user_imc_end: profile.user_imc_end,
            user_img_start: profile.user_img_start,
            user_img_end: profile.user_img_end,
            id: results.insertId,
          })
        },
        error => {
          console.error(error, 'Error inserting profile')
          reject(error)
        },
      )
    })
  })
}
async function UpdateProfileDb(db: SQLiteDatabase, profile: UserProfile): Promise<UserProfile> {
  return await new Promise<UserProfile>((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'UPDATE profile SET user_name=?, user_sexe=?, user_age=?, user_size=?, user_avatar=?, user_poids_start=?, user_poids_end=?, user_imc_start=?, user_imc_end=?,user_img_start=?,user_img_end=?  WHERE id=?',
        [
          profile.user_name,
          profile.user_sexe,
          profile.user_age,
          profile.user_size,
          profile.user_avatar,
          profile.user_poids_start,
          profile.user_poids_end,
          profile.user_imc_start,
          profile.user_imc_end,
          profile.user_img_start,
          profile.user_img_end,
          profile.id,
        ],
        (tx, results) => {
          resolve({
            user_name: profile.user_name,
            user_sexe: profile.user_sexe,
            user_age: profile.user_age,
            user_size: profile.user_size,
            user_avatar: profile.user_avatar,
            user_poids_start: profile.user_poids_start,
            user_poids_end: profile.user_poids_end,
            user_imc_start: profile.user_imc_start,
            user_imc_end: profile.user_imc_end,
            user_img_start: profile.user_img_start,
            user_img_end: profile.user_img_end,
            id: profile.id,
          })
        },
        error => {
          reject(error)
        },
      )
    })
  })
}

function GetPoidsIdeal(profile: UserProfile) {
  if (profile.user_sexe === 'Homme') {
    return Math.round(
      profile.user_size - 100 - ((profile.user_size - 150) / 4),
    )
  } else {
    return Math.round(
      profile.user_size - 100 - ((profile.user_size - 150) / 2.5),
    )
  }

}
