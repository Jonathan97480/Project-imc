import React from 'react'
import { Table, TableWrapper, Row, Rows } from 'react-native-table-component'
import { View, Text, Dimensions, ViewStyle, StyleSheet, TextStyle, Button } from 'react-native'

const [data2, setData2] = React.useState<any[]>([])

const CustomTable = () => {
  return (
    <Table borderStyle={{ borderWidth: 3, borderColor: '#c8e1ff' }}>
      <Row data={['date', 'poids', 'imc']} style={styles.head} />
      <Rows data={data2} textStyle={{ color: 'red' }} />
    </Table>
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

export default CustomTable
