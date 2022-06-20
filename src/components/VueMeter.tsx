import React from 'react';
import { View, Dimensions, Easing, Text } from 'react-native';
import { Canvas, Circle, Group, Skia, Path, Paint, SweepGradient, vec, useTiming } from "@shopify/react-native-skia";

interface DialProps {
    percent: number;
}


const VuMeterComponent = (props: DialProps) => {

    const padding = 24;
    const strokeWidth = 16;
    const screenWidth = Dimensions.get('window').width;
    const viewWidth = screenWidth - (padding * 2);
    const drawWidth = viewWidth - (strokeWidth * 2);

    const purple = '#9C27B0';
    const blue = '#29B6F6';
    const lightGrey = '#EEEEEE';
    const textPurple = '#311B92';
    const textGrey = '#616161';

    const path = Skia.Path.Make();
    path.moveTo(0, viewWidth / 2);
    path.addArc({ x: strokeWidth, y: strokeWidth, width: drawWidth, height: drawWidth }, 180, 180);


    const progress = useTiming(

        {
            from: 0,
            to: props.percent,

        }, {
        duration: 1000,
        easing: Easing.inOut(Easing.cubic),
    }
    )

    return (

        <View style={{ margin: padding, height: viewWidth, width: viewWidth }} >
            <Canvas style={{ width: viewWidth, height: viewWidth }}>

                <Path path={path} color="transparent" >
                    <Paint style="stroke" strokeWidth={strokeWidth} strokeCap="round" color={"lightGrey"} />

                </Path>
                <Path path={path} color="transparent" end={progress}>
                    <Paint style="stroke" strokeWidth={strokeWidth} strokeCap="round"  >
                        <SweepGradient
                            c={vec(viewWidth / 2, viewWidth / 2 + strokeWidth)}
                            colors={[purple, blue]}
                            start={80}
                            end={180 + (180 * props.percent)}
                        />
                    </Paint>
                </Path>


            </Canvas>
            <View style={{
                position: 'absolute',
                top: viewWidth * 0.1,
                left: 0,
                right: 0,
                bottom: viewWidth * 0.2,
                margin: padding + strokeWidth * 2

            }}>

                <Text
                    style={{
                        textAlign: 'center',
                        fontSize: 22,
                        color: textPurple,
                    }}
                >
                    IMC
                </Text>
                <Text
                    style={{
                        textAlign: 'center',
                        fontSize: 78,
                        color: textGrey
                    }}
                >
                    {props.percent}
                </Text>

            </View>
        </View >

    )
}


export default VuMeterComponent;