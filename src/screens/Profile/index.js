import {View,Image,Text,StatusBar} from "react-native";
import styles from "./styles.js";
import { useContext } from 'react';
import { UserContext } from '../../contexts/UserContext.js';
import ProfileCard from "../../components/ProfileCard";
import Options from "../../components/Options/index.js";    

export default function Profile(){
    const {user} = useContext(UserContext);
    return(
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#FFFFFF" />
            <View style={styles.viewTitle}>
            <Text style={styles.title}>Meu Perfil</Text>
            </View>
            <ProfileCard/>
            <Options name={"lock-closed-outline"} text={"Trocar Senha"} />
            <Options name={"lock-closed-outline"} text={"Trocar Senha"} />
        </View>
    )
}