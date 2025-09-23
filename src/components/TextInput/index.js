import { StyleSheet } from "react-native";
import {View,Text,TextInput} from "react-native";
import {Ionicons} from '@expo/vector-icons';


export default function TextInputComponent({label,placeholder,value,onChangeText,secureTextEntry,name,keyboardType,readOnly,size,style}){
    return(
        <View style={styles.container}>
            <Ionicons style={{marginRight:10}} name={name} size={size || 20} color="#A7A7A7" />
            <TextInput
                style={[styles.input, style]}
                placeholder={placeholder}
                value={value}
                placeholderTextColor={'#000000'}
                onChangeText={onChangeText}
                secureTextEntry={secureTextEntry}
                keyboardType={keyboardType}
                readOnly={readOnly}
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