import React from 'react'
import { View, Text, Image, Pressable, PermissionsAndroid, TextInput } from 'react-native'
import { SQLiteDatabase } from 'react-native-sqlite-storage'
import { ButtonComponent } from '../components/'
import { launchCamera, launchImageLibrary } from 'react-native-image-picker'
import { UserProfile } from '../interfaces'

interface HomeProps {
  db: SQLiteDatabase
  handleProfile: (profile: UserProfile) => void
  navigation: any
}

const AddProfile = (props: HomeProps) => {
  const { db, handleProfile, navigation } = props
  const [profile, setProfile] = React.useState<UserProfile>({
    id: 0,
    user_name: '',
    user_sexe: '',
    user_age: 0,
    user_size: 0,
    user_avatar: '',
  })
  const [isLoading, setIsLoading] = React.useState<boolean>(false)
  const [isScreen2, setIsScreen2] = React.useState<boolean>(false)

  if (isLoading) {
    return <Text>Loading...</Text>
  }
  if (!isScreen2) {
    return (
      <View>
        <Text>Crée un profil</Text>
        <Text>Slelectionée votre sexe</Text>
        <ButtonComponent
          onPress={() => {
            setProfile({
              ...profile,
              user_sexe: 'Femme',
            })
          }}
          title="Femme"
          color="pink"
          incon="venus"
        />
        <ButtonComponent
          onPress={() => {
            setProfile({
              ...profile,
              user_sexe: 'Homme',
            })
          }}
          title="Homme"
          color="blue"
          incon="mars"
        />
        <Text>Ajouter une photo </Text>
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
          }}
          title="Ajouter une photo"
          color="green"
          incon="camera"
        />
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
          }}
          title="Rechercher dans votre mobile"
          color="red"
          incon="image"
        />
        <Text>Ajouter un nom</Text>
        <TextInput
          placeholder="Nom"
          onChangeText={text => {
            setProfile({
              ...profile,
              user_name: text,
            })
          }}
        />

        <ButtonComponent
          onPress={() => {
            if (profile.user_name !== '') {
              if (profile.user_sexe != '') {
                setIsScreen2(true)
              } else {
                alert('Veuillez selectionner votre sexe')
              }
            } else {
              alert('Veuillez entrer un nom')
            }
          }}
          title="Suivant"
          color="black"
          incon="image"
        />
      </View>
    )
  } else {
    return (
      <View>
        <Text>Crée un profil</Text>
        <Text>Votre taille</Text>
        <TextInput
          placeholder="Taille"
          onChangeText={text => {
            setProfile({
              ...profile,
              user_size: parseInt(text),
            })
          }}
          keyboardType="numeric"
        />
        <Text>Votre age</Text>
        <TextInput
          placeholder="Age"
          onChangeText={text => {
            setProfile({
              ...profile,
              user_age: parseInt(text),
            })
          }}
          keyboardType="numeric"
        />
        <ButtonComponent
          onPress={() => {
            if (profile.user_name === '' || profile.user_size === 0 || profile.user_age === 0) {
              alert('Veuillez remplir tous les champs')
            } else {
              setIsLoading(true)
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
                      setIsLoading(false)
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
          }}
          title="Suivant"
          color="black"
          incon="image"
        />
      </View>
    )
  }
}

export default AddProfile
