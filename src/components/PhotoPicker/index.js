import { StyleSheet } from "react-native";
import {View,Text,TouchableOpacity} from "react-native";
import {Ionicons} from '@expo/vector-icons';


export default function PhotoPicker({name,onPress}){
    return(
        <View>
            <TouchableOpacity
                onPress={onPress}
                >
                <View style={styles.container}>
                        <Ionicons style={{marginRight:10}} name={name} size={20} color="#A7A7A7" />
                        <Text style={styles.texto}>Foto do Rosto</Text>
                </View>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        flexDirection:"row",
        alignItems:"center",
        backgroundColor:"#FFF",
        width:360,
        height:61,
        borderRadius:8,
        paddingHorizontal:10,
        marginVertical:5,
        borderWidth:1,
        borderColor:"#ddd",
        marginBottom:15,
    },
    input:{
        flex:1,
        height:45,
        color:'black',
    },
    texto:{
        textAlign:"center",

    }


})