import { View, Text, FlatList, StyleSheet, ViewStyle, Pressable } from 'react-native'
import React, { useEffect, useState } from 'react'
import { ButtonComponent, DragLeftBtn } from '../components/'
import { SQLiteDatabase } from 'react-native-sqlite-storage'
import { UserProfile } from '../interfaces'
import { Popin } from '../components'
import { ScrollView } from 'react-native-gesture-handler'
import { useNavigation } from '@react-navigation/native'
import { SafeAreaView } from 'react-native-safe-area-context'
import globalStyles from '../styles/global'
interface HomeProps {
  db: SQLiteDatabase
  navigation: any
  handleProfile: (profile: UserProfile) => void
}

const Home = (props: HomeProps) => {
  const { db, navigation, handleProfile } = props
  const [profile, setProfile] = React.useState<UserProfile[]>([])
  const [isLoading, setIsLoading] = React.useState<boolean>(true)
  const [showPopin, setShowPopin] = useState(false)
  const [idUserDelete, setidUserDelete] = useState(0)

  useEffect(() => {
    /* get profile */
    getAllProfile(db).then(_profile => {
      setProfile(_profile)
      setIsLoading(false)
    })
  }, [])

  if (isLoading) {
    return <Text>Loading...</Text>
  }

  if (profile.length > 0) {
    return (
      <CurentScreen
        _db={db}
        _setProfile={setProfile}
        profile={profile}
        handleProfile={handleProfile}
        navigation={navigation}
      />
    )
  }
  return <FirstScreen navigation={navigation} />
}

export default Home

interface CurentScreenProps {
  profile: UserProfile[]
  _db: SQLiteDatabase
  _setProfile: (p: UserProfile[]) => void
  navigation: any
  handleProfile: (profile: UserProfile) => void
}

const CurentScreen = (props: CurentScreenProps) => {
  return (
    <SafeAreaView style={globalStyles.safeArea}>
      <View>
        <Text
          style={[
            globalStyles.gap40,
            globalStyles.textBold,
            globalStyles.textCenter,
            globalStyles.textColorPrimary,
            globalStyles.textBold,
            globalStyles.textSize24,
          ]}>
          Heureux de vous revoir :)
        </Text>
        <Text
          style={[
            globalStyles.gap40,
            globalStyles.textLight,
            globalStyles.textColorPrimary,
            globalStyles.textCenter,
            globalStyles.textSize16,
          ]}>
          Veuillez choisir votre profil pour continuer
        </Text>

        <ScrollView style={globalStyles.gap20}>
          {props.profile.map(profile => (
            <DragLeftBtn
              onTap={() => {
                props.handleProfile(profile)

                props.navigation.navigate('PROFILE')
              }}
              key={profile.id}
              profile={profile}
              onDrag={() => {
                try {
                  deleteUserInfo(profile.id, props._db).then(list => {
                    if (list) {
                      props._setProfile(list)
                    }
                  })
                } catch (error) {
                  console.error(error)
                }
              }}
            />
          ))}
        </ScrollView>
        <View>
          <Pressable>
            <Text
              style={[
                globalStyles.textColorPrimary,
                globalStyles.textCenter,
                globalStyles.textSize16,
                globalStyles.textLight,
                { textDecorationLine: 'underline' },
              ]}>
              A propos
            </Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  )
}

interface FirstScreenProps {
  navigation: any
}
const FirstScreen = (props: FirstScreenProps) => {
  return (
    <SafeAreaView style={globalStyles.safeArea}>
      <View style={globalStyles.container}>
        <Text
          style={[
            globalStyles.gap40,
            globalStyles.textBold,
            globalStyles.textCenter,
            globalStyles.textColorPrimary,
            globalStyles.textBold,
            globalStyles.textSize24,
          ]}>
          Bonjour:)
        </Text>
        <Text
          style={[
            globalStyles.gap40,
            globalStyles.textLight,
            globalStyles.textColorPrimary,
            globalStyles.textCenter,
            globalStyles.textSize16,
          ]}>
          Bienvenue sur l’application IMC afin de continuer veuillez crée votre profil.{' '}
        </Text>
        <ButtonComponent
          style={globalStyles.ButtonStyle}
          onPress={() => {
            console.log('add profile')
            props.navigation.navigate('Add Profile')
          }}>
          <Text style={globalStyles.btnText}>Crée profil</Text>
        </ButtonComponent>
      </View>
    </SafeAreaView>
  )
}

/* Logique */
async function deleteUserInfo(_id: number, _db: SQLiteDatabase): Promise<UserProfile[] | void> {
  return new Promise((_resolve, _reject) => {
    _db.transaction(ty => {
      ty.executeSql(
        'DELETE FROM profile WHERE id =? ',
        [_id],

        () => {
          console.info('USER AND INFO USER DELETE')
        },
        error => {
          throw new Error(error.toString())
        },
      )
    })
    try {
      _db.transaction(ty => {
        ty.executeSql(
          'DELETE FROM imc WHERE id =? ',
          [_id],
          () => {
            getAllProfile(_db).then((listProfile: UserProfile[]) => {
              _resolve(listProfile)
            })
          },
          error => {
            throw new Error(error.toString())
          },
        )
      })
    } catch (error) {
      _reject(error)
      console.error(error)
    }
  })
}

async function getAllProfile(_db: SQLiteDatabase): Promise<UserProfile[]> {
  return new Promise((_resolve, _reject) => {
    _db.transaction(_tx => {
      _tx.executeSql(
        'SELECT * FROM profile',
        [],
        (_tx, _results) => {
          const profile: UserProfile[] = []
          for (let index = 0; index < _results.rows.length; index++) {
            const element: UserProfile = _results.rows.item(index)
            profile.push(element)
          }

          _resolve(profile)
        },
        error => _reject(error),
      )
    })
  })
}
