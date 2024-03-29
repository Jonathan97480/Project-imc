import React, { useEffect } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { SQLiteDatabase } from 'react-native-sqlite-storage'
import globalStyles from '../styles/global'

const PoidsCurent = (props: { db: SQLiteDatabase; idUser: number; currentImc: number }) => {
  const [lastPoids, setLastPoids] = React.useState(0)

  useEffect(() => {
    initInfoImg()
    return () => {
      setLastPoids(0)
    }
  }, [props.currentImc])

  const initInfoImg = () => {
    getLastEntry(props.db, props.idUser)
      .then(({ poids }) => {
        setLastPoids(poids)
      })
      .catch(err => {
        console.error(err)
      })
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Votre poids Actuelle</Text>
      <Text style={styles.value}>{lastPoids} Kg</Text>
    </View>
  )
}

export default PoidsCurent

async function getLastEntry(
  db: SQLiteDatabase,
  idUser: number,
): Promise<{ date: string; imc: number; img: number; poids: number }> {
  return await new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM imc WHERE user_id=? ORDER BY id DESC LIMIT 1',
        [idUser],
        (_, { rows }) => {
          const data = rows.item(0)

          resolve({
            date: serializeDate(data.imc_date),
            imc: data.user_imc,
            img: data.user_img,
            poids: data.user_poids,
          })
        },
      )
    })
  })
}

function serializeDate(date: string): string {
  const dateArray = date.split('/')
  return `${dateArray[2]}/${dateArray[1]}/${dateArray[0]}`
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#191E34',
    width: '45%',
    height: 90,
    borderColor: '#fff',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    flexDirection: 'column',
    alignItems: 'center',
    marginRight: 5,
    marginLeft: 5,
  },
  title: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
  },
  value: {
    color: '#fff',
    fontSize: 40,
    fontWeight: 'bold',
  },
})
