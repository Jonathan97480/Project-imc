import { View, Text, Pressable, StatusBar, Image } from 'react-native'
import React, { useEffect } from 'react'
import { ButtonComponent, DragLeftBtn } from '../components/'
import { SQLiteDatabase } from 'react-native-sqlite-storage'
import { UserProfile } from '../interfaces'
import { ScrollView } from 'react-native-gesture-handler'
import { SafeAreaView } from 'react-native-safe-area-context'
import globalStyles from '../styles/global'
import Logic from '../util/logic'
interface HomeProps {
  db: SQLiteDatabase
  navigation: any
  handleProfile: (profile: UserProfile | null) => void
}

const Home = (props: HomeProps) => {
  const { db, navigation, handleProfile } = props
  const [profile, setProfile] = React.useState<UserProfile[]>([])
  const [isLoading, setIsLoading] = React.useState<boolean>(true)

  useEffect(() => {
    /* get profile */
    Logic.getAllProfile(db).then(_profile => {
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
  handleProfile: (profile: UserProfile | null) => void
}

const CurentScreen = (props: CurentScreenProps) => {
  return (
    <SafeAreaView style={globalStyles.safeArea}>
      <StatusBar backgroundColor={'#1C2137'} />

      <View>
        <Text style={[globalStyles.gap40, globalStyles.title]}>Heureux de vous revoir :)</Text>
        <Text style={[globalStyles.gap40, globalStyles.paragraphe]}>
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
                  Logic.deleteUserInfo(profile.id, props._db).then(list => {
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
          <ButtonComponent
            style={[globalStyles.ButtonStyle, globalStyles.gap20]}
            onPress={() => {
              props.handleProfile(null)
              props.navigation.navigate('Add Profile')
            }}>
            <Text style={globalStyles.btnText}>Ajouter un profil</Text>
          </ButtonComponent>
        </ScrollView>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Pressable
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onPress={() => {
              props.navigation.navigate('About')
            }}>
            <Image source={require('../assets/img/icon_apropos.png')} style={{ marginRight: 10 }} />
            <Text style={[globalStyles.btnText, { textDecorationLine: 'underline' }]}>
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
      <StatusBar backgroundColor={'#1C2137'} />

      <View style={globalStyles.container}>
        <Text style={[globalStyles.gap40, globalStyles.title]}>Bonjour:)</Text>
        <Text style={[globalStyles.gap40, globalStyles.paragraphe]}>
          Bienvenue sur l’application IMC afin de continuer veuillez crée votre profil.{' '}
        </Text>
        <ButtonComponent
          style={globalStyles.ButtonStyle}
          onPress={() => {
            props.navigation.navigate('Add Profile')
          }}>
          <Text style={globalStyles.btnText}>Crée profil</Text>
        </ButtonComponent>
      </View>
    </SafeAreaView>
  )
}
