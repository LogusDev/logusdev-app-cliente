import { StyleSheet } from "react-native";
import Constants from "expo-constants";

const styles = StyleSheet.create({
    container:{
        flex:1,
        justifyContent:"center",
        alignItems:"center",
        backgroundColor:"#FFFFFF",
        paddingTop: Constants.statusBarHeight + 10,

    },
    logo:{
        width:185.62,
        height:42.17,
        position:"absolute",
        top:70
    },
    texto:{
        fontSize:22,
        fontWeight:"bold",
        color:"#1F284E",
        padding:24,
    },
    texto2:{
        textAlign:"center",
    }
})

export default styles;