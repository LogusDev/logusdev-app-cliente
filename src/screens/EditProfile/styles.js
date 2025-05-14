import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container:{
        flex:1,
        alignItems:"center",
        backgroundColor:"#FFFFFF",
    },
    title:{
        alignItems:"flex-start",
        color:"#1F284E",
        fontSize:32,
        fontWeight:200,
        marginRight:"40%",
        marginTop:33,
        fontFamily:"Poppins-SemiBold",
    },
    avatar:{
        width: 119,
        height: 125,
        borderRadius: 100,
        marginTop: 60,     
        marginBottom: 60, 
    },
    textInput:{
        textAlignVertical: 'center',
        paddingVertical:0,
        lineHeight:22,
        fontFamily:'Poppins-Regular',
        color:'#A7A7A7',
        height:60
    },
    textInputMail:{
        textAlignVertical: 'center',
        paddingVertical:0,
        lineHeight:22,
        fontFamily:'Poppins-Regular',
        color:'#1F284E',
        height:60
    },
    textInputPhone:{
        textAlignVertical: 'center',
        paddingVertical:0,
        lineHeight:22,
        fontFamily:'Poppins-Regular',
        color:'#1F284E',
        height:60
    }
})

export default styles;