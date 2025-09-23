import { StyleSheet, TextInput } from "react-native";
import Constants from "expo-constants";

const styles = StyleSheet.create({
    container:{
        flex:1,
        paddingTop: Constants.statusBarHeight + 10,
        paddingHorizontal: 16,
        backgroundColor:"#fff"
    },
    leftIcon:{
        justifyContent:"center",
        alignItems:"center",
        marginLeft: 8,
    },
    divider:{
        height:1,
        backgroundColor:"#ddd",
        marginVertical: 16,
    }
});

export default styles;