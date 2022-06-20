import React from 'react';
import { View, Text, Image, Pressable } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { ButtonComponent, ProfileComponent } from '../components/';

interface ProfileProps {
    profile: UserProfile;
    navigation: any;
}
interface UserProfile {
    id: number;
    user_name: string;
    user_sexe: string;
    user_age: number;
    user_size: number;
    user_avatar: string;
}

const Profile = (props: ProfileProps) => {

    const { navigation, profile } = props;

    return (
        <View>
            <ProfileComponent profile={profile} />
            <View>
                <Text>Taille</Text>
                <Text>{profile.user_size}</Text>
            </View>

            <View>
                <Text>Age</Text>
                <Text>{profile.user_age}</Text>
            </View>

            <ButtonComponent
                onPress={() => {
                    navigation.navigate("IMC CALCUL");
                }}
                title="IMC CALCUL"
                color="#00ff00"
                incon="plus"
            />
        </View>
    );
};

export default Profile;

const ProfileDetails = props => {
    const { route, navigation } = props;
    const profile: UserProfile = route.params.profile;
    return (
        <View>
            <ProfileComponent profile={profile} />
            <View>
                <Text>Taille</Text>
                <Text>{profile.user_size}</Text>
            </View>

            <View>
                <Text>Age</Text>
                <Text>{profile.user_age}</Text>
            </View>

            <ButtonComponent
                onPress={() => { }}
                title="IMC CALCUL"
                color="#00ff00"
                incon="plus"
            />
        </View>
    );
};
