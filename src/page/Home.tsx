import { View, Text, FlatList, StyleSheet, ViewStyle } from 'react-native'
import React, { useEffect, useState } from 'react'
import { ProfileComponent, ButtonComponent } from '../components/'
import { SQLiteDatabase } from 'react-native-sqlite-storage'
import { UserProfile } from '../interfaces'
import { Popin } from '../components'

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

  return (
    <View style={styles.contenaire}>
      {showPopin && (
        <PopinDeleteUser
          _id={idUserDelete}
          _callBack={() => {
            setShowPopin(false)
          }}
          _db={db}
          _setProfile={p => {
            setProfile(p)
          }}
        />
      )}
      {profile.length > 0 && (
        <FlatList
          data={profile}
          renderItem={({ item }) => (
            <ProfileComponent
              profile={item}
              onPress={() => {
                handleProfile(item)
                navigation.navigate('PROFILE')
              }}
              onLongPress={() => {
                setidUserDelete(item.id)
                setShowPopin(true)
              }}
            />
          )}
          keyExtractor={item => item.id.toString()}
          horizontal={true}
        />
      )}
      {profile.length == 0 && <Text>No profile</Text>}
      <ButtonComponent
        onPress={() => {
          navigation.navigate('Add Profile')
        }}
        title="Ajoutée un profile"
        color="#00ff00"
        incon="plus"
      />
    </View>
  )
}

interface Styles {
  contenaire: ViewStyle
}
/* style */
const styles = StyleSheet.create<Styles>({
  contenaire: {
    padding: 10,
    height: '100%',
  },
})

export default Home

/* Components */
const PopinDeleteUser = (props: {
  _id: number
  _callBack: () => void
  _db: SQLiteDatabase
  _setProfile: (profile: UserProfile[]) => void
}) => {
  return (
    <Popin
      title="Supprimer votre compte"
      message="voulez-vous supprimer votre compte"
      buttons={[
        {
          label: 'ok',
          action: () => {
            try {
              deleteUserInfo(props._id, props._db).then(list => {
                if (list) {
                  props._setProfile(list)
                }
              })
              props._callBack()
            } catch (error) {
              console.error(error)
            }
          },
          color: 'green',
        },
        {
          label: 'Cancel',
          action: () => {
            props._callBack()
          },
          color: 'red',
        },
      ]}
    />
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
          console.log('USER AND INFO USER DELETE')
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
