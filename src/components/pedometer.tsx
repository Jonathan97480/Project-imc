import React from 'react'
import { StyleSheet, Text, View, Button, Image } from 'react-native'
import { SQLiteDatabase } from 'react-native-sqlite-storage'
import { ImcTable, UserProfile } from '../interfaces'
import { Pedometer } from 'expo-sensors'
import * as TaskManager from 'expo-task-manager'

const PEDOMETER_TASK_NAME = 'background-Pedometer-task'

const PedometerComponent = () => {
  const [isPedometerAvailable, setIsPedometerAvailable] = React.useState('false')
  const [pastStepCount, setPastStepCount] = React.useState(0)
  let subScription: Pedometer.Subscription | undefined = undefined

  React.useEffect(() => {
    subScribe()
  }, [])

  const subScribe = () => {
    subScription = Pedometer.watchStepCount(result => {
      setPastStepCount(result.steps)
    })

    Pedometer.isAvailableAsync().then(
      result => {
        setIsPedometerAvailable(String(result))
      },
      error => {
        setIsPedometerAvailable('Could not get isPedometerAvailable: ' + error)
      },
    )
  }
  return (
    <View>
      <Text>Step count: {pastStepCount}</Text>
      <Text> PEDOMETER IS AVAILABLE : {String(isPedometerAvailable)}</Text>
      <Button
        title="Start"
        onPress={() => {
          console.log('HELLO TEST')
        }}
      />
    </View>
  )
}

TaskManager.defineTask(PEDOMETER_TASK_NAME, ({ data, error }) => {
  if (error) {
    // Error occurred - check `error.message` for more details.
    console.log('ERROR')
  } else {
    // Do something with the data returned by the watch.
    console.log('DATA', data)
  }
})

export default PedometerComponent
