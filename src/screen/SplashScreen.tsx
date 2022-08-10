import React, { useEffect } from 'react'
import { SafeAreaView, StatusBar, View, Image } from 'react-native'
import { JumpingTransition } from 'react-native-reanimated'
import { ResultSet, SQLiteDatabase } from 'react-native-sqlite-storage'
import globalStyles from '../styles/global'
import { createTable } from '../util/model'

const SplashScreen = (props: any) => {
  const TIME_CHANGE_SCREEN = 2000
  const { db } = props

  /* populateDataBase(db, 1) */

  useEffect(() => {
    InitApp(db)
  }, [])

  const InitApp = (db: SQLiteDatabase) => {
    createProfileDataBase(db)
      .then(() => {
        createImcDataBase(db).then(() => {
          setTimeout(() => {
            props.navigation.reset({
              index: 0,
              routes: [{ name: 'Home' }],
            })
          }, TIME_CHANGE_SCREEN)
        })
      })
      .catch(err => {
        console.error(err)
      })
  }

  return (
    <SafeAreaView style={[globalStyles.safeArea, { backgroundColor: '#fff' }]}>
      <StatusBar backgroundColor={'#1C2137'} />
      <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <Image
          source={require('../assets/img/logo.png')}
          style={{ width: '60%', height: '60%', resizeMode: 'cover' }}
        />
      </View>
    </SafeAreaView>
  )
}

export default SplashScreen

/**
 * Create the profile table if not exist
 * @param db SQLiteDatabase
 */
async function createProfileDataBase(db: SQLiteDatabase) {
  return new Promise((resolve, reject) => {
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
        result => {
          console.info(result.rowsAffected.toString(), 'ROWS AFFECTED ADD TABLE PROFILE')
          resolve(true)
        },
      )
    } catch (error) {
      reject(error)
    }
  })
}

/**
 * Create the imc table if not exist
 * @param db SQLiteDatabase
 */
async function createImcDataBase(db: SQLiteDatabase) {
  return await new Promise((resolve, reject) => {
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
          resolve(true)
        },
      )
    } catch (error) {
      reject(error)
    }
  })
}
