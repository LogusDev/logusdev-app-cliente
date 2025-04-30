import { StatusBar, StyleSheet, Text,View } from "react-native";
import MapView, {Marker} from 'react-native-maps';
import { useContext } from 'react';
import { UserContext } from '../../contexts/UserContext';

export default function MainHome(){


    const {user} = useContext(UserContext);

    return(
        <View style={styles.container}>
            <StatusBar/>
            <MapView
            initialRegion={{
                latitude: -23.5505,
                longitude: -46.6333,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,}}
            showsUserLocation={true}
            style={{flex: 1}}
            showsMyLocationButton={true}
            >
               
             </MapView>
            <View style={styles.containerCard}>
                    <Text style={{fontSize:22,color:'#1F284E',fontWeight:600,marginTop:36}}>Para onde vamos ?</Text>
            </View>
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