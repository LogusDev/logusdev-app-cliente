import {View,Image,Text,StatusBar} from "react-native";
import styles from "./styles.js";
import { useContext } from 'react';
import { UserContext } from '../../contexts/UserContext';

export default function Profile(){
    const {user} = useContext(UserContext);
    return(
        <View>
            <Text>{user.nome}</Text>
            <Text>{user.id}</Text>
        </View>
    )
}