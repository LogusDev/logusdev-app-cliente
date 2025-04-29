import { StyleSheet } from "react-native";
import {View,Text,TextInput} from "react-native";
import {Ionicons} from '@expo/vector-icons';


export default function TextInputComponent({label,placeholder,value,onChangeText,secureTextEntry,name}){
    return(
        <View style={styles.container}>
            <Ionicons style={{marginRight:10}} name={name} size={20} color="#A7A7A7" />
            <TextInput
                style={styles.input}
                placeholder={placeholder}
                value={value}
                onChangeText={onChangeText}
                secureTextEntry={secureTextEntry}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        flexDirection:"row",
        alignItems:"center",
        backgroundColor:"#FFF",
        width:"90%",
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
    }

})