import { StatusBar, StyleSheet, Text, View, TouchableOpacity, Animated, Modal } from "react-native"; // Adicionado Animated
import React, { useEffect, useState, useRef } from "react"; // Adicionado useRef
import MapView, { Marker } from 'react-native-maps';
import { getCurrentPositionAsync, LocationAccuracy, requestForegroundPermissionsAsync, watchPositionAsync } from "expo-location";
import Ionicons from 'react-native-vector-icons/Ionicons';
import PhotoCard from "../../components/PhotoCard";
import LoadingScreen from "../../components/LoadingScreen";

export default function MainHome({ navigation }) {
    const [location, setLocation] = useState(null);
    const [permissionDenied, setPermissionDenied] = useState(false);
    const [isLoading, setIsLoading] = useState(true); 
    const fadeAnim = useRef(new Animated.Value(1)).current;

    const onLoadingComplete = () => {
        const MINIMUM_LOADING_TIME = 5000; 

        const elapsedTime = Date.now() - startTime.current;
        const remainingTime = MINIMUM_LOADING_TIME - elapsedTime;

        setTimeout(() => {
            Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 500, 
                useNativeDriver: true,
            }).start(() => {
                setIsLoading(false); 
            });
        }, remainingTime > 0 ? remainingTime : 0);
    };

    const startTime = useRef(null);

    useEffect(() => {
        startTime.current = Date.now();

        async function requestLocationPermission() {
            const { granted } = await requestForegroundPermissionsAsync();

            if (granted) {
                const currentPosition = await getCurrentPositionAsync();
                setLocation(currentPosition.coords);
                onLoadingComplete(); 
            } else {
                setPermissionDenied(true);
                onLoadingComplete(); 
            }
        }

        requestLocationPermission();

        let watcher;
        const startWatching = async () => {
            watcher = await watchPositionAsync({
                accuracy: LocationAccuracy.Highest,
                timeInterval: 1000,
                distanceInterval: 10,
            }, (response) => {
                setLocation(response.coords);
            });
        };

        startWatching();

        return () => {
            if (watcher) {
                watcher.remove();
            }
        };
    }, []); 

    if (isLoading) {
        return (
            <Modal
                visible={true}
                transparent={false}
                animationType="fade"
            >
                <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
                    <LoadingScreen />
                </Animated.View>
            </Modal>
        );
    }

    return (
        <View style={styles.container}>
            <StatusBar backgroundColor={'#FFFFFF'} barStyle={"dark-content"} />
            {permissionDenied ? (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
                    <Text style={{ textAlign: 'center' }}>
                        Permissão de localização negada. Habilite-a nas configurações do dispositivo para usar o mapa.
                    </Text>
                </View>
            ) : (
                <>
                    <MapView
                        region={{
                            latitude: location.latitude,
                            longitude: location.longitude,
                            latitudeDelta: 0.005,
                            longitudeDelta: 0.005,
                        }}
                        mapType="standard"
                        showsBuildings={true}
                        style={styles.map}
                        showsMyLocationButton={true}
                        provider="google"
                    >
                        <Marker
                            coordinate={{
                                latitude: location.latitude,
                                longitude: location.longitude,
                            }}
                        />
                    </MapView>
                    <View style={styles.photoCard}>
                        <PhotoCard />
                    </View>
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
                            onPress={() => {
                                navigation.navigate('OriginDestiny', { userLocation: location });
                            }}
                        >
                            <Ionicons name="map-outline" size={15} />
                        </TouchableOpacity>
                    </View>
                </>
            )}
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
        height: '35%',
        alignItems: 'center',
    },
    photoCard:{
        position:'absolute',
        top:50,
        left:'80%',
        right:40,
        zIndex:10,
        borderRadius:3,
        borderColor:'#EF8108'
    },
    map:{
        flex:1,
    }
});