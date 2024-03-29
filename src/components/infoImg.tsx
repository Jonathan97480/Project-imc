import { View, Text, StyleSheet } from 'react-native'
import React, { useEffect } from 'react'
import { SQLiteDatabase } from 'react-native-sqlite-storage'
import globalStyles from '../styles/global'

const InfoImg = (props: { db: SQLiteDatabase; idUSer: number | undefined }) => {
  const [data, setData] = React.useState({ img: 0, imc: 0, date: '' })
  const [img, setImg] = React.useState(0)
  const [imc, setImc] = React.useState(0)
  const [date, setDate] = React.useState('')

  if (data.img === 0 && props.idUSer != undefined) {
    getLastEntry(props.db, props.idUSer)
      .then(({ date, imc, img }) => {
        setData({ date, imc, img })
      })
      .catch(err => {
        console.error(err)
      })
  }

  useEffect(() => {
    initInfoImg(data)
    return () => {
      setImg(0)
      setImc(0)
      setDate('')
    }
  }, [data])

  const initInfoImg = data => {
    setImg(data.img)
    setImc(data.imc)
    setDate(data.date)
  }

  return (
    <View style={styles.container}>
      <Text style={[styles.title, globalStyles.gap20]}>Dernière Valeur relevée le : {date}</Text>
      <View style={styles.ligne}>
        <Text style={styles.ligneText}>IMC : </Text>
        <Text style={styles.ligneValue}>{imc}</Text>
      </View>
      <View style={styles.ligne}>
        <Text style={styles.ligneText}>IMG : </Text>
        <Text style={[styles.ligneValue, { backgroundColor: '#0d9515' }]}>{img} %</Text>
      </View>
    </View>
  )
}

async function getLastEntry(
  db: SQLiteDatabase,
  idUser: number,
): Promise<{ date: string; imc: number; img: number }> {
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
    flexDirection: 'column',

    backgroundColor: '#1C2137',
    borderRadius: 10,
    padding: 10,
    elevation: 5,
    marginBottom: 40,
  },
  title: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
  ligne: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 10,
  },
  ligneText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '500',
  },
  ligneValue: {
    backgroundColor: '#cd4da8',
    paddingHorizontal: 10,
    borderRadius: 5,
    marginHorizontal: 10,
    color: 'white',
    fontWeight: 'bold',
  },
})

export default InfoImg
