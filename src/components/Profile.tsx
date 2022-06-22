import React from "react";
import {
    View,
    Text,
    Image,
    Pressable,
    TouchableOpacity,
    Alert
} from "react-native";
import { UserProfile } from "../interfaces";

interface ProfileComponentProps {
    profile: UserProfile | null;
    onPress?: () => void;
    onLongPress?: () => void
}
const ProfileComponent = (props: ProfileComponentProps) => {

    const { profile, onLongPress } = props;

    if (!profile) {
        return (
            <View>No profile</View>
        );
    }



    return (
        <TouchableOpacity
            onPress={() => {
                if (props.onPress) {
                    props.onPress();
                }
            }
            }

            onLongPress={
                () => {
                    onLongPress ? onLongPress() : ""
                }
            }

        >
            <View>
                {

                    profile.user_avatar === "" ?
                        <Image source={
                            profile.user_sexe === "Femme" ?
                                require("../assets/img/avatar_femme.png") :
                                require("../assets/img/avatar_homme.png")
                        }
                            style={{ width: 100, height: 100, backgroundColor: "red" }}

                        /> :
                        <Image source={
                            {
                                uri: profile.user_avatar
                            }}
                            style={{ width: 100, height: 100, backgroundColor: "red" }}

                        />
                }

                <Text>{profile?.user_name}</Text>

            </View>
        </TouchableOpacity >
    );
}



export default ProfileComponent;