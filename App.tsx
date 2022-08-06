/* eslint-disable @typescript-eslint/indent */
import { Home, AddProfile, Profile, ImcCalcul, StateInfo, About } from './src/page'
import React, { useEffect, useState } from 'react'
import { dbInit, createTable } from './src/util/model'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { ResultSet, SQLiteDatabase } from 'react-native-sqlite-storage'
import { ImcTable, UserProfile } from './src/interfaces'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import Icon from 'react-native-vector-icons/FontAwesome'
import populateDataBase from './src/util/devUtil'
let db: SQLiteDatabase

dbInit().then(_db => {
  db = _db
})

let curentUser: UserProfile | null = null

const Tab = createBottomTabNavigator()
const Stack = createNativeStackNavigator()

const App = () => {
  const [historique, setHistorique] = useState<
    { date: string; poids: number; imc: number; img: number }[] | null
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
  /* populateDataBase(db, 1) */
  useEffect(() => {
    createProfileDataBase(db)
    createImcDataBase(db)
  }, [])

  const handleProfile = (profile: UserProfile | null) => {
    if (profile === null) {
      curentUser = null
      setHistorique(null)
      return
    }
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
          <Stack.Screen options={{ headerShown: false }} name="About">
            {props => <About {...props} />}
          </Stack.Screen>
        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  )
}

interface HomeTabsProps {
  db: SQLiteDatabase
  updateHistorique: (profile: UserProfile) => void
  historique: { date: string; poids: number; imc: number; img: number }[] | null
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
        {props => (
          <ImcCalcul db={db} profile={curentUser} updateHistorique={updateHistorique} {...props} />
        )}
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
            historique={historique}
            {...props}
            db={db}
            profile={curentUser}
            updateHistorique={updateHistorique}
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
        'user_size INTEGER',
        'user_age INTEGER',
        'user_sexe TEXT',
        'user_poids_start FLOAT',
        'user_poids_end FLOAT',
        'user_imc_start FLOAT',
        'user_imc_end  FLOAT',
        'user_img_start FLOAT',
        'user_img_end FLOAT',
      ],
      (result: ResultSet) => {
        console.info(result.rowsAffected.toString(), 'ROWS AFFECTED ADD TABLE PROFILE')
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
        'user_poids FLOAT',
        'user_imc FLOAT',
        'user_img FLOAT',
        'imc_date DATE',
      ],
      (result: ResultSet) => {
        console.info(result.rowsAffected.toString(), 'ROWS AFFECTED ADD TABLE IMC')
      },
    )
  } catch (error) {
    console.error(error)
  }
}

async function getHistoriqueUser(
  profile: UserProfile,
): Promise<{ date: string; poids: number; imc: number; img: number }[]> {
  const curentDate = new Date()
  const currentDay = curentDate.getDate() + 1
  const currentMonth = curentDate.getMonth() + 1
  const currentYear = curentDate.getFullYear()

  let stringMonth = currentMonth.toString()
  let stringDay = currentDay.toString()

  if (currentMonth.toString().length === 1) {
    stringMonth = '0' + currentMonth.toString()
  }
  if (currentDay.toString().length === 1) {
    stringDay = '0' + currentDay.toString()
  }
  let startDay: number | string = currentDay - 6
  if (startDay < 1) {
    startDay = 1
  }
  if (startDay.toString().length === 1) {
    startDay = '0' + startDay.toString()
  }
  const dateIntervalle = {
    end: `${currentYear}/${stringMonth}/${stringDay}`,
    start: `${currentYear}/${stringMonth}/${startDay}`,
  }

  return new Promise<{ date: string; poids: number; imc: number; img: number }[]>(
    (resolve, reject) => {
      db.transaction(tx => {
        tx.executeSql(
          `SELECT * FROM imc WHERE imc_date BETWEEN  '${dateIntervalle.start}'  AND  '${dateIntervalle.end}' AND user_id = ${profile.id} ORDER BY imc_date ASC`,
          [],
          (tx, results) => {
            console.info(results, 'GET HISTORIQUE')
            const len = results.rows.length
            const list: { date: string; poids: number; imc: number; img: number }[] = []

            for (let i = 0; i < len; i++) {
              const ligne: ImcTable = results.rows.item(i)
              list.push({
                date: ligne.imc_date.toString(),
                poids: ligne.user_poids,
                imc: ligne.user_imc,
                img: ligne.user_img,
              })
            }

            resolve(list)
          },
          error => {
            reject(error)
          },
        )
      })
    },
  )
}

export default App
