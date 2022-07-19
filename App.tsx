/* eslint-disable @typescript-eslint/indent */
import { Home, AddProfile, Profile, ImcCalcul, StateInfo } from './src/page'
import React, { useEffect, useState } from 'react'
import { dbInit, createTable } from './src/util/model'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { ResultSet, SQLiteDatabase } from 'react-native-sqlite-storage'
import { ImcTable, UserProfile } from './src/interfaces'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import Icon from 'react-native-vector-icons/FontAwesome'
let db: SQLiteDatabase

dbInit().then(_db => {
  db = _db
})

let curentUser: UserProfile | null = null

const Tab = createBottomTabNavigator()
const Stack = createNativeStackNavigator()

const App = () => {
  const [historique, setHistorique] = useState<
    { date: string | Date; poids: number; imc: number }[] | null
  >(null)
  const updateHistorique = (profile: UserProfile) => {
    getHistoriqueUser(profile)
      .then(historique => {
        setHistorique(historique)
      })
      .catch(err => {
        console.error(err)
      })
  }

  useEffect(() => {
    createProfileDataBase(db)
    createImcDataBase(db)
  }, [])

  const handleProfile = (profile: UserProfile) => {
    curentUser = profile
    updateHistorique(profile)
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen name="Home" options={{ headerShown: false }}>
            {props => <Home {...props} db={db} handleProfile={handleProfile} />}
          </Stack.Screen>

          <Stack.Screen name="Add Profile" options={{ headerShown: false }}>
            {props => (
              <AddProfile
                {...props}
                db={db}
                handleProfile={handleProfile}
                curentProfile={curentUser}
              />
            )}
          </Stack.Screen>

          <Stack.Screen options={{ headerShown: false }} name="PROFILE">
            {props => (
              <HomeTabs
                {...props}
                db={db}
                updateHistorique={updateHistorique}
                historique={historique}
              />
            )}
          </Stack.Screen>
        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  )
}

interface HomeTabsProps {
  db: SQLiteDatabase
  updateHistorique: (profile: UserProfile) => void
  historique: { date: string | Date; poids: number; imc: number }[] | null
}

function HomeTabs(props: HomeTabsProps) {
  const { db, updateHistorique, historique } = props
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="profile"
        options={{
          headerShown: false,
          tabBarInactiveBackgroundColor: '#191E34',
          tabBarActiveBackgroundColor: '#1E1E1E',
          tabBarIcon: ({ color }) => <Icon name="user" size={20} color="#fff" />,
        }}>
        {props => (
          <Profile db={db} profile={curentUser} {...props} updateHistorique={updateHistorique} />
        )}
      </Tab.Screen>
      <Tab.Screen
        name="IMC CALCUL"
        options={{
          headerShown: false,
          tabBarInactiveBackgroundColor: '#191E34',
          tabBarActiveBackgroundColor: '#1E1E1E',
          tabBarIcon: ({ color }) => <Icon name="calculator" size={20} color="#fff" />,
        }}>
        {props => <ImcCalcul db={db} profile={curentUser} updateHistorique={updateHistorique} />}
      </Tab.Screen>
      <Tab.Screen
        name="STATE INFO"
        options={{
          headerShown: false,
          tabBarInactiveBackgroundColor: '#191E34',
          tabBarActiveBackgroundColor: '#1E1E1E',
          tabBarIcon: ({ color }) => <Icon name="bar-chart" size={20} color="#fff" />,
        }}>
        {props => (
          <StateInfo
            {...props}
            db={db}
            profile={curentUser}
            updateHistorique={updateHistorique}
            historique={historique}
          />
        )}
      </Tab.Screen>
    </Tab.Navigator>
  )
}

/**
 * Create the profile table if not exist
 * @param db SQLiteDatabase
 */
function createProfileDataBase(db: SQLiteDatabase) {
  try {
    createTable(
      db,
      'profile',
      [
        'id INTEGER PRIMARY KEY AUTOINCREMENT',
        'user_name VARCHAR(100)',
        'user_avatar TEXT',
        ' user_size INTEGER',
        'user_age INTEGER',
        'user_sexe TEXT',
      ],
      (result: ResultSet) => {
        console.log(result)
      },
    )
  } catch (error) {
    console.error(error)
  }
}

/**
 * Create the imc table if not exist
 * @param db SQLiteDatabase
 */
function createImcDataBase(db: SQLiteDatabase) {
  try {
    createTable(
      db,
      'imc',
      [
        'id INTEGER PRIMARY KEY AUTOINCREMENT',
        'user_id INTEGER',
        'user_name VARCHAR(100)',
        'user_poids INTEGER',
        'user_imc INTEGER',
        'imc_date DATE',
      ],
      (result: ResultSet) => {
        console.log(result)
      },
    )
  } catch (error) {
    console.error(error)
  }
}

async function getHistoriqueUser(
  profile: UserProfile,
): Promise<{ date: string | Date; poids: number; imc: number }[]> {
  return new Promise<{ date: string | Date; poids: number; imc: number }[]>((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM imc WHERE user_id=?',
        [profile?.id],
        (tx, results) => {
          console.log(results, 'result imc table')
          const len = results.rows.length
          const list: { date: string | Date; poids: number; imc: number }[] = []

          for (let i = 0; i < len; i++) {
            const ligne: ImcTable = results.rows.item(i)
            list.push({ date: ligne.imc_date, poids: ligne.user_poids, imc: ligne.user_imc })
          }

          resolve(list)
        },
        error => {
          reject(error)
        },
      )
    })
  })
}

export default App
