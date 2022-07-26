import React from 'react'
import { Dimensions, View } from 'react-native'
import { LineChart } from 'react-native-chart-kit'

interface ChartProps {
  imc: number[]
  poids: number[]
  labels: string[]
}

const Chart = (props: ChartProps) => {
  const { imc, poids, labels } = props
  const screenWidth = Dimensions.get('window').width
  const chartConfig = {
    backgroundGradientFrom: '#1C2137',
    backgroundGradientFromOpacity: 0,
    backgroundGradientTo: '#1C2137',
    backgroundGradientToOpacity: 0.5,
    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    strokeWidth: 2, // optional, default 3
    barPercentage: 0.5,
    useShadowColorFromDataset: false, // optional
  }
  const newData = {
    labels: labels,
    datasets: [
      {
        data: imc,
        color: (opacity = 1) => `rgba(224, 81, 180, ${opacity})`, // optional
        strokeWidth: 2, // optional
      },
      {
        data: poids,
        color: (opacity = 1) => `rgba(58, 12, 203, ${opacity})`, // optional
        strokeWidth: 2, // optional
      },
    ],
    legend: ['IMC', 'POIDS'], // optional
  }
  return (
    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
      <LineChart data={newData} width={screenWidth} height={220} chartConfig={chartConfig} bezier />
    </View>
  )
}

export default Chart
