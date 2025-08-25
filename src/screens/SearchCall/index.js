import React, { useRef, useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { Video } from 'expo-av';
import MapView, { Marker } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import Button from '../../components/Button';
import styles from './style';
import { UserContext } from '../../contexts/UserContext';
import { useContext } from 'react';
import IconOrigem from '../../components/IconOrigem';
import SearchingVideo from '../../assets/images/searching.mp4';
import MapViewDirections from 'react-native-maps-directions';
import { useFocusEffect } from '@react-navigation/native';
import { getCallStatus, cancelCall } from '../../services/calls';
import { AppState } from 'react-native';

export default function SearchCall({ route, navigation }) {
    const { origem, destino, actualVehicle, callId } = route.params;
    const mapRef = useRef(null);
    const { user } = useContext(UserContext);
    const [videoReady, setVideoReady] = useState(false);

    // polling do status
    useFocusEffect(
        React.useCallback(() => {
            let cancelled = false;
            let delayMs = 2000;
            const appStateRef = { current: AppState.currentState };

            const onAppStateChange = (next) => {
                appStateRef.current = next;
            };
            const sub = AppState.addEventListener('change', onAppStateChange);
            let timer = null;

            const poll = async () => {
                if (cancelled) return;
                if (appStateRef.current !== 'active') {
                    timer = setTimeout(poll, 2000);
                    return;
                }
                try {
                    const res = await getCallStatus(callId);
                    if (res?.status_chamado && res.status_chamado !== 'aguardando') {
                        cancelled = true;
                        if (timer) clearTimeout(timer);
                        navigation.replace('CallProgress', { origem, destino, actualVehicle, callId });
                        return;
                    }
                    delayMs = Math.min(10000, Math.round(delayMs * 1.5));
                } catch (e) {
                    delayMs = Math.min(10000, Math.round(delayMs * 1.5));
                } finally {
                    if (!cancelled) timer = setTimeout(poll, delayMs);
                }
            };

            poll();

            return () => {
                cancelled = true;
                if (timer) clearTimeout(timer);
                sub.remove();
            };
        }, [callId, navigation, origem, destino, actualVehicle])
    );

    // Substitua esta chave pela sua chave real da Google Maps API.
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
                        title="Origem"
                        description={origem.endereco}
                        pinColor="green"
                    >
                        <IconOrigem width={31} height={31} />
                    </Marker>
                )}
                {destino?.lat && destino?.lng && (
                    <Marker
                        coordinate={{ latitude: destino.lat, longitude: destino.lng }}
                        title="Destino"
                        description={destino.endereco}
                        pinColor="red"
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
                <Text style={styles.sectionTitle}>Buscando Guincheiro...</Text>
                <View style={{ height: 200, width: 200 }}>
                    <Video
                        source={SearchingVideo}
                        style={{ height: '100%', width: '100%' }}
                        resizeMode="cover"
                        isLooping
                        shouldPlay
                        onLoad={() => setVideoReady(true)}
                    />
                </View>

                {/* Origem */}
                <View style={styles.infoItem}>
                    <Ionicons name="map" size={24} color="#FFA500" style={styles.infoIcon} />
                    <View style={styles.textContainer}>
                        <Text style={styles.placeTitle}>
                            <Text style={{ fontWeight: 'bold' }}>
                                {origem.titulo || origem.endereco.split('-')[0]}
                            </Text>
                        </Text>
                        <Text style={styles.placeAddress}>
                            {origem.endereco.split('-')[1] ? origem.endereco.split('-')[1].trim() : origem.endereco}
                        </Text>
                    </View>
                </View>

                <View style={styles.separatorLine} />

                {/* Destino */}
                <View style={styles.infoItem}>
                    <Ionicons name="location" size={24} color="#FFA500" style={styles.infoIcon} />
                    <View style={styles.textContainer}>
                        <Text style={styles.placeTitle}>
                            <Text style={{ fontWeight: 'bold' }}>
                                {destino.titulo || destino.endereco.split('-')[0]}
                            </Text>
                        </Text>
                        <Text style={styles.placeAddress}>
                            {destino.endereco.split('-')[1] ? destino.endereco.split('-')[1].trim() : destino.endereco}
                        </Text>
                    </View>
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

                <Button text="Cancelar" style={{ backgroundColor: 'red' }} onPress={async () => {
                    try {
                        if (callId) await cancelCall(callId);
                    } catch {}
                    navigation.goBack();
                }} />
            </View>
        </View>
    );
}