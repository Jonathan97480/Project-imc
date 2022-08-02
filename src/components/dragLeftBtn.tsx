/* eslint-disable react/prop-types */
import React from 'react'
import {
  View,
  ViewStyle,
  ImageStyle,
  StyleSheet,
  Dimensions,
  Image,
  Text,
  TextStyle,
} from 'react-native'
import {
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
  PanGestureHandlerProps,
  GestureDetector,
  Gesture,
} from 'react-native-gesture-handler'
import Animated, {
  runOnJS,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'
import { UserProfile } from '../interfaces'
import globalStyles from '../styles/global'
import Icon from 'react-native-vector-icons/FontAwesome'

const { width: SCREEN_WIDTH } = Dimensions.get('window')
const TRANSLATE_X_THRESHOLD = -SCREEN_WIDTH * 0.3
interface DragLeftBtnProps extends Pick<PanGestureHandlerProps, 'simultaneousHandlers'> {
  profile: UserProfile
  onDrag: () => void
  onTap?: () => void
}

const DragLeftBtn = (props: DragLeftBtnProps) => {
  const singleTap = Gesture.Tap()
  singleTap.maxDuration(1000)
  singleTap.onStart(() => {
    if (props.onTap) {
      props.onTap()
    }
  })

  const translateX = useSharedValue(0)
  const panGesture = useAnimatedGestureHandler<PanGestureHandlerGestureEvent>({
    onActive: event => {
      if (event.translationX < 0) {
        translateX.value = event.translationX
      } else {
        translateX.value = 0
      }
    },
    onEnd: () => {
      const shouldBeDismissed = translateX.value < TRANSLATE_X_THRESHOLD
      if (shouldBeDismissed) {
        translateX.value = withTiming(-SCREEN_WIDTH)
        runOnJS(props.onDrag)()
      } else {
        translateX.value = withTiming(0)
      }
    },
  })
  const rContenteAnimation = useAnimatedStyle(() => {
    const opacity = withTiming(translateX.value < TRANSLATE_X_THRESHOLD ? 1 : 0)
    return { opacity }
  })
  const rStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: translateX.value,
      },
    ],
    backgroundColor: '#191E34',
    elevation: 10,
    height: 50,
    width: '100%',
  }))
  return (
    <View style={[styles.container, globalStyles.gap20]}>
      <Animated.View style={[{ height: 71 }, rContenteAnimation, styles.icon]}>
        <Icon name="trash-o" size={40} color="red" style={styles.iconFont} />
      </Animated.View>
      <GestureDetector gesture={Gesture.Exclusive(singleTap)}>
        <PanGestureHandler
          simultaneousHandlers={props.simultaneousHandlers}
          onGestureEvent={panGesture}>
          <Animated.View style={[rStyle, styles.content]}>
            {props.profile.user_avatar === '' || props.profile.user_avatar === null ? (
              <Image
                style={styles.avatar}
                source={
                  props.profile.user_sexe === 'Femme'
                    ? require('../assets/img/avatar_femme.png')
                    : require('../assets/img/avatar_homme.png')
                }
              />
            ) : (
              <Image
                source={{
                  uri: props.profile.user_avatar,
                }}
                style={styles.avatar}
              />
            )}
            <Text
              style={[
                globalStyles.textColorPrimary,
                globalStyles.textSize16,
                globalStyles.textMedium,
                {
                  textTransform: 'capitalize',
                  width: '65%',
                  textAlign: 'center',
                },
              ]}>
              {props.profile.user_name}
            </Text>
          </Animated.View>
        </PanGestureHandler>
      </GestureDetector>
    </View>
  )
}
interface Styles {
  container: ViewStyle
  content: ViewStyle
  avatar: ImageStyle
  icon: ViewStyle
  iconFont: TextStyle
}
const styles = StyleSheet.create<Styles>({
  container: {
    margin: 10,
    height: 71,
    borderRadius: 5,
  },
  content: {
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    height: '100%',
    width: '100%',
    borderRadius: 5,
  },
  avatar: {
    width: 47,
    height: 47,
    borderRadius: 50,
    marginRight: 20,
  },
  icon: {
    position: 'absolute',
    right: 0,
    top: 0,
    borderRadius: 5,
    width: '100%',

    paddingRight: 30,
    paddingTop: 15,
  },
  iconFont: {
    textAlign: 'right',
  },
})

export default DragLeftBtn
