
import React from "react";
import { View, Text, Image, Pressable } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";



interface ButtonProps {
    onPress: () => void;
    title: string;
    color: string;
    incon: string;
}


const ButtonComponent = (props: ButtonProps) => {

    const { onPress, title, color, incon } = props;
    return (
        <Pressable onPress={onPress}>
            <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: color,
                padding: 10,
                borderRadius: 10
            }}>
                <Icon name={incon} size={20} color="#fff" />
                <Text style={{
                    color: "#fff",
                    fontSize: 20,
                    marginLeft: 10
                }}>{title}</Text>
            </View>
        </Pressable>
    );
}


export default ButtonComponent;