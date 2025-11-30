import { StyleSheet } from "react-native";
import Constants from "expo-constants";

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:"#FFFFFF",
    },
    scrollContainer:{
        flexGrow:1,
        justifyContent:"center",
        alignItems:"center",
        paddingTop: Constants.statusBarHeight + 10,
        paddingBottom: 20,
    },
    texto:{
        fontSize:22,
        fontWeight:"bold",
        color:"#1F284E",
        padding:8,
        fontFamily:"Poppins-SemiBold",
        fontWeight:"bold",
    },
})

export default styles;
