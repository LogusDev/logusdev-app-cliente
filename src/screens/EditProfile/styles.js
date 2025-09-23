import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container:{
        flex:1,
        justifyContent:"center",
        alignItems:"center",
        backgroundColor:"#FFFFFF",
    },
    title:{
        alignItems:"flex-start",
        color:"#1F284E",
        fontSize:32,
        fontWeight:200,
        marginRight:"40%",
        marginTop:10,
        fontFamily:"Poppins-SemiBold",
    },
    avatar:{
        width: 171,
        height: 180,
        borderRadius: 100,
        marginTop: 40,     
        marginBottom: 40, 
        borderWidth: 3,
        borderColor: '#DADADA',
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