import React from 'react'
import { Table, TableWrapper, Row, Rows } from 'react-native-table-component'
import { View, Text, Dimensions, ViewStyle, StyleSheet, TextStyle, Button } from 'react-native'
import { useEffect } from 'react'

interface TableProps {
  data: { imc: number[]; poids: number[]; date?: string[] }
}

const CustomTable = (props: TableProps) => {
  const { data } = props
  const [tableData, setTableData] = React.useState<{
    imc: number[]
    poids: number[]
    date?: string[]
  }>({ imc: [], poids: [] })

  useEffect(() => {
    setTableData(data)
  }, [data])
  console.log(tableData)
  return (
    <Table borderStyle={{ borderWidth: 0, borderColor: '#c8e1ff' }}>
      <Row data={['Date', 'Poids', 'Imc']} style={styles.head} textStyle={styles.headText} />
      {dataSerialize(tableData).map((rowData, index) => (
        <Row
          key={index}
          data={rowData}
          textStyle={styles.rowText}
          style={[styles.row, index % 2 && { backgroundColor: '#272E4E' }]}
        />
      ))}
    </Table>
  )
}

interface Styles {
  container: ViewStyle
  head: ViewStyle
  headText: TextStyle
  row: ViewStyle
  rowText: TextStyle
  text: TextStyle
}

const styles = StyleSheet.create<Styles>({
  container: { flex: 1, padding: 16, paddingTop: 30, backgroundColor: '#fff' },
  head: { height: 23, marginBottom: 23 },
  headText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 20,
    textAlign: 'center',
  },
  row: {
    backgroundColor: '#1C2137',
    height: 28,
  },
  rowText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 15,
  },
  text: { margin: 6 },
})

function dataSerialize(tableData: { imc: number[]; poids: number[]; date?: string[] }) {
  const rows: (string | number)[][] = []
  for (let index = 0; index < tableData.imc.length; index++) {
    const row = [
      tableData.date ? tableData.date[index] : '',
      tableData.poids[index],
      tableData.imc[index],
    ]

    rows.push(row)
  }
  return rows
}

export default CustomTable
