import React, { useRef, useState } from 'react';
import { View, Text, Image, Alert, ActivityIndicator, StyleSheet } from 'react-native';
import Button from '../../components/Button';
import MapView, { Marker } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import styles from './style';
import IconOrigem from '../../components/IconOrigem';
import { updateCall } from '../../services/calls';
import RatingModal from '../../screens/RatingModal'; 

export default function CallCompleted({ route, navigation }) {
    const { origem, destino, guincheiro, callId, vehicle } = route.params;
    const mapRef = useRef(null);
    const [isLoading, setIsLoading] = useState(false);
    
    const [isRatingModalVisible, setRatingModalVisible] = useState(false);

    const GOOGLE_API_KEY = 'AIzaSyAmfl_CD7XtRiiETKRzh0EfQmtVW59b-Cw';

    const handleFinalizar = async () => {
        if (isLoading) return;
        setIsLoading(true);
        try {
            await updateCall(callId, { status_chamado: 'concluído' });
            console.log('Chamado finalizado e status atualizado no backend.');
            
            setRatingModalVisible(true); 

        } catch (error) {
            console.error('Erro ao finalizar o chamado:', error);
            Alert.alert('Erro', 'Não foi possível finalizar o chamado. Tente novamente.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <MapView
                provider="google"
                ref={mapRef}
                style={styles.map}
                initialRegion={{
                    latitude: origem.lat,
                    longitude: origem.lng,
                    latitudeDelta: 0.05,
                    longitudeDelta: 0.05,
                }}
            >
                <Marker coordinate={{ latitude: origem.lat, longitude: origem.lng }} title="Ponto de partida">
                    <IconOrigem width={35} height={35} />
                </Marker>

                <Marker coordinate={{ latitude: destino.lat, longitude: destino.lng }} title="Destino final">
                    <Ionicons name="flag" size={30} color="#3498db" />
                </Marker>
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
                                <Text style={styles.ratingText}>{guincheiro.rating?.toFixed(1) || 'N/A'}★</Text>
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
            />
        </View>
    );
}
