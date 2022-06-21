import React from 'react';
import { View, Text, Image, Pressable } from 'react-native';
import { ButtonComponent, ProfileComponent } from '../components/';
import { UserProfile } from '../interfaces';
import { SQLiteDatabase } from 'react-native-sqlite-storage';

interface ImcProps {
    profile: UserProfile | null;
    navigation: any
    db: SQLiteDatabase
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
