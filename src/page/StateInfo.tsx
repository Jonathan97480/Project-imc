import React from 'react';
import { View, Text, Image, Pressable } from 'react-native';
import { ButtonComponent, ProfileComponent } from '../components/';

interface ImcProps {
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

const StateInfo = (props: ImcProps) => {
    const { navigation, profile } = props;
    return (
        <View>
            <Text>State & info</Text>
        </View>
    );
};

export default StateInfo;
