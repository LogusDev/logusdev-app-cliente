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
        padding:8,
        fontFamily:"Poppins-SemiBold",
        fontWeight:"bold",
    },
    texto2:{
        textAlign:"center",
        color:"#929292",
        fontSize:13,
        paddingHorizontal:24,
        paddingBottom:24,
    },
    backButton: {
        position: 'absolute',
        top: Constants.statusBarHeight + 20,
        left: 20,
        zIndex: 10,
        padding: 8,
    },
})

export default styles;