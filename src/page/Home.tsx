import {
    View,
    Text,
    SafeAreaView,
    FlatList,
    StyleSheet,
    ViewStyle
} from "react-native";
import React, { useEffect } from "react";
import { dbInit, getAll, insert } from "../util/model";
import { ProfileComponent, ButtonComponent } from "../components/";
import { SQLiteDatabase } from "react-native-sqlite-storage";


interface UserProfile {
    id: number;
    user_name: string;
    user_sexe: string;
    user_age: number;
    user_size: number;
    user_avatar: string;
}

interface HomeProps {
    db: SQLiteDatabase;
    navigation: any;
    handleProfile: Function;
}

const Home = (props: HomeProps) => {

    const { db, navigation, handleProfile } = props;
    const [profile, setProfile] = React.useState<UserProfile[]>([]);
    const [isLoading, setIsLoading] = React.useState<boolean>(true);

    useEffect(() => {

        /* get profile */
        getAllProfile(db).then(_profile => {
            setProfile(_profile);
            setIsLoading(false);

        });

    }, []);


    if (isLoading) {
        return <Text>Loading...</Text>;

    }


    return (
        <View style={styles.contenaire} >
            <FlatList
                data={profile}
                renderItem={({ item }) => <ProfileComponent
                    profile={item}
                    onPress={() => {
                        console.log("onPress");
                        handleProfile(item);
                        navigation.navigate("PROFILE");
                    }
                    }
                />}
                keyExtractor={item => item.id.toString()}
                horizontal={true}
            />
            <ButtonComponent
                onPress={() => {
                    navigation.navigate("Add Profile");


                }}
                title="Ajoutée un profile"
                color="#00ff00"
                incon="plus" />

        </View>
    );
}

interface Styles {
    contenaire: ViewStyle;
}
/* style */
const styles = StyleSheet.create<Styles>({
    contenaire: {
        padding: 10,

    },
});



/* Logique */
async function getAllProfile(db: any): Promise<UserProfile[]> {
    return new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
                `SELECT * FROM profile`,
                [],
                (tx, results) => {
                    const profile: UserProfile[] = [];
                    for (let index = 0; index < results.rows.length; index++) {
                        const element: UserProfile = results.rows.item(index);
                        profile.push(element);


                    }

                    resolve(profile);

                }, error => reject(error),
            );
        });
    });
}

export default Home;