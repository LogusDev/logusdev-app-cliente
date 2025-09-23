import { StatusBar, StyleSheet, Text,View } from "react-native";


export default function Activity(){

    return(
        <View style={styles.container}>
            <Text>Activity</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
    },
    containerCard:{
        backgroundColor: '#fff',
        width: '100%',
        height:'50%',
        alignItems: 'center',
    }
})