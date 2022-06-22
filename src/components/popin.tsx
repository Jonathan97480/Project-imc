import React from "react"
import { View, Text, Pressable, ViewStyle, StyleSheet } from "react-native"

interface PopinInterface {
    title: string
    message: string
    buttons: {
        label: string
        action: () => void
        color: string
    }[]

}


const Popin = (props: PopinInterface) => {
    const { title, message, buttons } = props

    return (
        <View style={styles.popinContenaire}>
            <Text>{title}</Text>

            <View style={styles.btnContenaire}>
                <Text>{message}</Text>

                {
                    buttons.map((button, index) => {

                        return <Pressable
                            style={{
                                ...styles.btn, backgroundColor: button.color
                            }}
                            key={index + button.label}
                            onPress={button.action}

                        >
                            <Text style={styles.btnText}>{button.label}</Text>
                        </Pressable >


                    })

                }

            </View>

        </View >
    )

}

interface Styles {
    popinContenaire: ViewStyle;
    btnContenaire: ViewStyle;
    btn: ViewStyle;
    btnText: ViewStyle;

}

const styles = StyleSheet.create<Styles>({

    popinContenaire: {
        backgroundColor: "white",
        padding: 16,
        borderRadius: 15,
        borderWidth: 3,
        position: "absolute",
        zIndex: 9999,
        top: "40%",
        left: "17%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "center",
        minHeight: 150

    },
    btnContenaire: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%"
    },
    btn: {
        minWidth: 100,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: 10,
        marginBottom: 4,
        marginTop: 4

    },
    btnText: {
        color: "#ffff",
        fontWeight: "bold",

    }


}



)

export default Popin