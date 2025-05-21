import { StatusBar, StyleSheet, Text, View,TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import MapView, { Marker } from 'react-native-maps';
import { getCurrentPositionAsync, LocationAccuracy, requestForegroundPermissionsAsync, watchPositionAsync } from "expo-location";
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function MainHome() {
    const [location, setLocation] = useState(null);
    const [permissionDenied, setPermissionDenied] = useState(false);

    async function requestLocationPermission() {
        const { granted } = await requestForegroundPermissionsAsync();

        if (granted) {
            const currentPosition = await getCurrentPositionAsync();
            console.log('Localização obtida:', currentPosition);
            setLocation(currentPosition.coords);
        } else {
            console.log('Permissão de localização negada');
            setPermissionDenied(true);
        }
    }

    useEffect(() => {
        requestLocationPermission();
    }, []);

    useEffect(() => {
        const watchPosition = async () => {
            await watchPositionAsync({
                accuracy: LocationAccuracy.Highest,
                timeInterval: 1000,
                distanceInterval: 10,
            }, (response) => {
                console.log('Nova localização recebida:', response.coords);
                setLocation(response.coords);
            });
        };

        watchPosition();
    }, []);

    useEffect(() => {
        console.log('Localização atual:', location);
    }, [location]);

    return (
        <View style={styles.container}>
            <StatusBar backgroundColor={'#FFFFFF'} barStyle={"light-content"} />
            {permissionDenied ? (
                <Text style={{ textAlign: 'center', marginTop: 20 }}>
                    Permissão de localização negada. Habilite-a nas configurações do dispositivo.
                </Text>
            ) : (
                location && location.latitude && location.longitude ? (
                    <MapView
                        region={{
                            latitude: location.latitude,
                            longitude: location.longitude,
                            latitudeDelta: 0.005,
                            longitudeDelta: 0.005,
                        }}
                        style={{ flex: 1 }}
                        showsMyLocationButton={true}
                    >
                        <Marker
                            coordinate={{
                                latitude: location.latitude,
                                longitude: location.longitude,
                            }}
                        />
                    </MapView>
                ) : (
                    console.log('Mapa não renderizado: localização inválida ou não carregada')
                )
            )}
            <View style={styles.containerCard}>
                <Text style={{ fontSize: 22, color: '#1F284E', fontWeight: '600', marginTop: 36 }}>
                    Para onde vamos?
                </Text>
                <TouchableOpacity
                  style={{
                    width: '90%',
                    backgroundColor: '#FFFFFF',
                    borderRadius: 8,
                    padding: 16,
                    marginTop: 16,
                    borderWidth: 2,
                    borderColor: '#EAEAEA',
                  }}
                  
                >
                    <Ionicons name="map-outline" size={15}  />
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFFFFF",
    },
    containerCard: {
        backgroundColor: '#fff',
        width: '100%',
        height: '30%',
        alignItems: 'center',
    },
});