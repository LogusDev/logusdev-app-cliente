import { StyleSheet, View, Image } from "react-native";
import { useContext } from "react";
import { UserContext } from "../../contexts/UserContext";


export default function PhotoCard(){
    const { user } = useContext(UserContext);
    

    return(
        <View>
            <Image
            src={user.foto_url}
            width={59}
            height={59}
            style={{borderRadius:40,borderColor:'#EF8108',borderWidth:3}}
            />
        </View>
    )
    
}