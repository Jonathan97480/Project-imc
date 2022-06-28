import React, { useEffect } from 'react'
import { View, Text, Dimensions, ViewStyle, StyleSheet, TextStyle, Button } from 'react-native'
import { Table, TableWrapper, Row, Rows } from 'react-native-table-component'
import { UserProfile, ImcTable } from '../interfaces'
import { SQLiteDatabase } from 'react-native-sqlite-storage'
import { LineChart } from 'react-native-chart-kit'

interface ImcProps {
  profile: UserProfile | null
  navigation: any
  db: SQLiteDatabase
}

const StateInfo = (props: ImcProps) => {
  const { navigation, profile } = props
  const screenWidth = Dimensions.get('window').width
  const chartConfig = {
    backgroundGradientFrom: '#1E2923',
    backgroundGradientFromOpacity: 0,
    backgroundGradientTo: '#08130D',
    backgroundGradientToOpacity: 0.5,
    color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
    strokeWidth: 2, // optional, default 3
    barPercentage: 0.5,
    useShadowColorFromDataset: false, // optional
  }
  const [data2, setData2] = React.useState<any[]>([])
  const data = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June'],
    datasets: [
      {
        data: [20, 45, 28, 80, 99, 43],
        color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`, // optional
        strokeWidth: 2, // optional
      },
    ],
    legend: ['Rainy Days'], // optional
  }

  useEffect(() => {
    props.db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM imc WHERE user_id=?',
        [profile?.id],
        (tx, results) => {
          console.log(results, 'result imc table')
          const len = results.rows.length
          const list: any[] = []

          for (let i = 0; i < len; i++) {
            const ligne: ImcTable = results.rows.item(i)
            list.push([ligne.imc_date, ligne.user_poids, ligne.user_imc])

            /*   list.push(ligne) */
          }
          setData2(list)
        },
        error => {
          console.error(error, 'error imc table')
        },
      )
    })
  }, [])

  return (
    <View>
      <View>
        <Button
          title="Mois"
          onPress={() => {
            console.log('Mois')
          }}
        />
        <Button
          title="Année"
          onPress={() => {
            console.log('Anée')
          }}
        />
        <Button
          title="semaine"
          onPress={() => {
            console.log('Anée')
          }}
        />
      </View>
      <LineChart data={data} width={screenWidth} height={220} chartConfig={chartConfig} bezier />
      <View>
        <Table borderStyle={{ borderWidth: 3, borderColor: '#c8e1ff' }}>
          <Row data={['date', 'poids', 'imc']} style={styles.head} />
          <Rows data={data2} textStyle={{ color: 'red' }} />
        </Table>
      </View>
    </View>
  )
}

interface Styles {
  container: ViewStyle
  head: ViewStyle
  text: TextStyle
}

const styles = StyleSheet.create<Styles>({
  container: { flex: 1, padding: 16, paddingTop: 30, backgroundColor: '#fff' },
  head: { height: 40, backgroundColor: '#f1f8ff' },
  text: { margin: 6 },
})
export default StateInfo
