import React from 'react'
import {
  SafeAreaView,
  StatusBar,
  Text,
  View,
  Image,
  Pressable,
  Linking,
  ImageSourcePropType,
} from 'react-native'
import globalStyles from '../styles/global'
import Icon from 'react-native-vector-icons/FontAwesome'
import { color } from 'react-native-reanimated'

interface Props {
  image: ImageSourcePropType
  title: string
  text: string
  confIcon: number
  urlTwitter?: string
  urlInstagram?: string
  urlWebsite?: string
  urlTwitch?: string
  urlLinkedIn?: string
}

const Card = (props: Props) => {
  return (
    <View style={{ marginBottom: 40 }}>
      <View style={{ flexDirection: 'column', alignItems: 'center' }}>
        <Image source={props.image} style={{ borderRadius: 50, marginBottom: 20 }} />
        <Text style={[globalStyles.paragraphe, globalStyles.gap20]}>{props.title}</Text>
        <Text style={[globalStyles.paragraphe, globalStyles.gap20]}>{props.text}</Text>
      </View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        {props.confIcon === 0 && (
          <Pressable
            onPress={() => {
              if (props.urlTwitter) {
                Linking.openURL(props.urlTwitter)
              }
            }}>
            <Icon
              name="twitter-square"
              style={[globalStyles.textSize24, { color: '#ffff', marginRight: 40 }]}
            />
          </Pressable>
        )}
        <Pressable
          onPress={() => {
            if (props.urlWebsite) {
              Linking.openURL(props.urlWebsite)
            }
          }}>
          <Icon
            name="globe"
            style={[globalStyles.textSize24, { color: '#ffff', marginRight: 40 }]}
          />
        </Pressable>
        <Pressable
          onPress={() => {
            if (props.urlLinkedIn) {
              Linking.openURL(props.urlLinkedIn)
            }
          }}>
          <Icon
            name="linkedin-square"
            style={[
              globalStyles.textSize24,
              { color: '#ffff' },
              props.confIcon === 1 && { marginRight: 40 },
            ]}
          />
        </Pressable>
        {props.confIcon === 1 && (
          <Pressable
            onPress={() => {
              if (props.urlInstagram) {
                Linking.openURL(props.urlInstagram)
              }
            }}>
            <Icon
              name="instagram"
              style={[globalStyles.textSize24, { color: '#ffff', marginRight: 40 }]}
            />
          </Pressable>
        )}
        {props.confIcon === 1 && (
          <Pressable
            onPress={() => {
              if (props.urlTwitch) {
                Linking.openURL(props.urlTwitch)
              }
            }}>
            <Icon name="twitch" style={[globalStyles.textSize24, { color: '#ffff' }]} />
          </Pressable>
        )}
      </View>
    </View>
  )
}

export default Card
