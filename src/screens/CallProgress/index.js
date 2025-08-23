import React, { useRef, useEffect, useState } from 'react';
import { View, Text,Image } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import styles from './style';
import { UserContext } from '../../contexts/UserContext';
import { useContext } from 'react';
import IconOrigem from '../../components/IconOrigem';
import MapViewDirections from 'react-native-maps-directions';

export default function CallProgress({ route, navigation }) {
    const { origem, destino, actualVehicle, callId } = route.params;
    const mapRef = useRef(null);
    const { user } = useContext(UserContext);

    console.log(actualVehicle.modelo)

    const GOOGLE_API_KEY = 'AIzaSyAaHYGbfNa4N9Me-f2g8hlwahNYZLy5l0U';

    const onMapReady = () => {
        if (mapRef.current && origem && destino) {
            mapRef.current.fitToCoordinates(
                [
                    { latitude: origem.lat, longitude: origem.lng },
                    { latitude: destino.lat, longitude: destino.lng }
                ],
                {
                    edgePadding: { top: 100, right: 100, bottom: 100, left: 100 },
                    animated: true
                }
            );
        }
    };

    return (
        <View style={styles.container}>
            <MapView
                ref={mapRef}
                style={styles.map}
                onMapReady={onMapReady}
                initialRegion={{
                    latitude: origem.lat,
                    longitude: origem.lng,
                    latitudeDelta: 0.05,
                    longitudeDelta: 0.05,
                }}
            >
                {origem?.lat && origem?.lng && (
                    <Marker
                        coordinate={{ latitude: origem.lat, longitude: origem.lng }}
                        title="Você"
                        description={origem.endereco}
                    >
                        <IconOrigem width={31} height={31} />
                    </Marker>
                )}
                {destino?.lat && destino?.lng && (
                    <Marker
                        coordinate={{ latitude: destino.lat, longitude: destino.lng }}
                        title="Guincheiro"
                        description={destino.endereco}
                    >
                        <IconOrigem width={31} height={31} />
                    </Marker>
                )}
                
                {origem && destino && (
                    <MapViewDirections
                        origin={{ latitude: origem.lat, longitude: origem.lng }}
                        destination={{ latitude: destino.lat, longitude: destino.lng }}
                        apikey={GOOGLE_API_KEY}
                        strokeWidth={3}
                        strokeColor="#EF8108"
                    />
                )}
            </MapView>

            <View style={styles.infoContainer}>
                <Text style={styles.sectionTitle}>Situação do chamado:</Text>

                {/* Origem */}
                <View style={styles.infoItem}>
                    <View style={styles.textContainer}>
                        
                    </View>
                </View>

                <View style={styles.separatorLine} />

                {/* Destino */}
                <View style={styles.infoItem}>
                    
                </View>

                <View style={styles.separatorLine} />

                {/* Veículo */}
                <View style={styles.infoItem}>
                    <Ionicons name="car-sport" size={24} color="#FFA500" style={styles.infoIcon} />
                    <View style={styles.textContainer}>
                        <Text style={styles.placeTitle}>{actualVehicle?.modelo}</Text>
                        <Text style={styles.placeAddress}>{actualVehicle?.marca} • {actualVehicle?.ano_fabricacao}</Text>
                    </View>
                </View>
            </View>
        </View>
    );
}