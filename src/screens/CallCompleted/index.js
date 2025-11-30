import React, { useRef, useState, useEffect } from 'react'; 
import { View, Text, Image, ActivityIndicator, StyleSheet } from 'react-native';
import Button from '../../components/Button';
import MapView, { Marker } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import styles from './style';
import IconOrigem from '../../components/IconOrigem';
import RatingModal from '../../screens/RatingModal'; 
import MapViewDirections from 'react-native-maps-directions';

export default function CallCompleted({ route, navigation }) {

    
    const { origem, destino, guincheiro, callId, vehicle, guincheiroInfo } = route.params;
    const mapRef = useRef(null);
    const [isLoading, setIsLoading] = useState(false);
    
    const [isRatingModalVisible, setRatingModalVisible] = useState(false);

    const GOOGLE_API_KEY = 'AIzaSyBkx6mo29bFuoPzoNSLpE97c8EoWptHl1M';

    useEffect(() => {
        const timer = setTimeout(() => {
            setRatingModalVisible(true);
        }, 500);
        return () => clearTimeout(timer);
    }, []);

    const handleFinalizar = () => {
        navigation.reset({
            index: 0,
            routes: [{ name: 'MainHome' }],
        });
    };


    useEffect(() => {
        if (mapRef.current && origem?.lat && destino?.lat) {
            
            const coordinates = [
                { latitude: origem.lat, longitude: origem.lng },
                { latitude: destino.lat, longitude: destino.lng }
            ];

            mapRef.current.fitToCoordinates(coordinates, {
                edgePadding: { top: 100, right: 50, bottom: 100, left: 50 },
                animated: true
            });
        }
            }, [mapRef.current, origem, destino]); 


    const initialRegion = {
        latitude: -14.2350,
        longitude: -51.9253,
        latitudeDelta: 45,
        longitudeDelta: 45,
    };

    return (
        <View style={styles.container}>
            <MapView
                provider="google"
                ref={mapRef} 
                style={styles.map}

                initialRegion={initialRegion} 
            >
                {origem?.lat && (
                    <Marker coordinate={{ latitude: origem.lat, longitude: origem.lng }} title="Ponto de partida">
                        <IconOrigem width={35} height={35} />
                    </Marker>
                )}

                {destino?.lat && (
                    <Marker coordinate={{ latitude: destino.lat, longitude: destino.lng }} title="Destino final">
                        <Ionicons name="flag" size={30} color="#3498db" />
                    </Marker>
                )}

                {(origem?.lat && destino?.lat) && (
                    <MapViewDirections
                        origin={{ latitude: origem.lat, longitude: origem.lng }}
                        destination={{ latitude: destino.lat, longitude: destino.lng }}
                        apikey={GOOGLE_API_KEY}
                        strokeWidth={3}
                        strokeColor="#3498db" 
                        onError={(errorMessage) => {
                            console.warn('[CallCompleted] Erro API Directions:', errorMessage);
                        }}
                    />
                )}
            </MapView>

            <View style={styles.infoContainer}>
                <Text style={styles.sectionTitle}>Chamado Concluído</Text>
                
                <View style={styles.guincheiroContainer}>
                    <Image
                        style={styles.guincheiroImage}
                        source={{ uri: guincheiro.photo }}
                    />
                    <View style={styles.guincheiroInfo}>
                        <View style={styles.nameRatingRow}>
                            <Text style={styles.guincheiroName}>{guincheiro.name}</Text>
                            <View style={styles.ratingContainer}>
                                <Text style={styles.ratingText}>{guincheiroInfo?.media_avaliacoes || 'N/A'}★</Text>
                            </View>
                        </View>
                        <Text style={styles.guincheiroCalls}>
                            Mais de {guincheiro.calls} chamados atendidos
                        </Text>
                        
                        <View style={styles.vehicleInfoInline}>
                            <View style={styles.vehicleTextContainer}>
                                <Text style={styles.vehicleModel}>
                                    {vehicle.model} - {vehicle.color}
                                </Text>
                                <Text style={styles.licensePlate}>
                                    Placa: {vehicle.licensePlate}
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>

                <View style={styles.separatorLine} />
                
                <View style={styles.timeContainer}>
                    <Text style={styles.timeText}>
                        <Text style={styles.timeHighlight}>{guincheiro.name}</Text> concluiu o transporte do seu veículo.
                    </Text>
                </View>

                <View style={styles.buttonContainer}>
                    <Button
                        text={isLoading ? <ActivityIndicator color="#fff" /> : 'Finalizar'}
                        onPress={handleFinalizar}
                        disabled={isLoading}
                    />
                </View>
            </View>

            <RatingModal
                visible={isRatingModalVisible}
                onClose={() => setRatingModalVisible(false)}
                guincheiro={guincheiro}
                vehicle={vehicle}
                callId={callId}
                navigation={navigation}
                guincheiroInfo={guincheiroInfo}
                route={route}
            />
        </View>
    );
}