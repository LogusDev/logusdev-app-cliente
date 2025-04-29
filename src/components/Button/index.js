import {View,TouchableOpacity,Text,StyleSheet} from "react-native";


export default function Button(props){
    return(
        <TouchableOpacity style={styles.button} onPress={props.onPress}>
            <Text style={styles.buttonText}>{props.text}</Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    button:{
        color: '#fff',
        backgroundColor:'#EF8108',
        width: '90%',
        height: 47,
        borderRadius: 15,
        padding: 12,
        marginTop: 20,
        alignItems: 'center',
      },
      buttonText:{
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        padding:1,
      }
})