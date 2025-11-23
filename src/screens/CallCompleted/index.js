import React, { useRef, useState, useEffect } from 'react'; // 1. Importar useEffect
import { View, Text, Image, Alert, ActivityIndicator, StyleSheet } from 'react-native';
import Button from '../../components/Button';
import MapView, { Marker } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import styles from './style';
import IconOrigem from '../../components/IconOrigem';
import { updateCall } from '../../services/calls';
import RatingModal from '../../screens/RatingModal'; 
import MapViewDirections from 'react-native-maps-directions';

export default function CallCompleted({ route, navigation }) {
    // DEBUG: Verifique o que está chegando
    // console.log("DADOS RECEBIDOS:", JSON.stringify(route.params, null, 2));
    
    const { origem, destino, guincheiro, callId, vehicle, guincheiroInfo } = route.params;
    const mapRef = useRef(null);
    const [isLoading, setIsLoading] = useState(false);
    
    const [isRatingModalVisible, setRatingModalVisible] = useState(false);

    const GOOGLE_API_KEY = 'AIzaSyAmfl_CD7XtRiiETKRzh0EfQmtVW59b-Cw';

    const handleFinalizar = async () => {
        // ... (sem alterações)
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

    // --- 2. ALTERADO ---
    // Usamos useEffect para reagir *depois* que os dados (origem/destino)
    // e o mapa (mapRef.current) estiverem prontos.
    useEffect(() => {
        // Só executa se o mapa estiver pronto E os dados existirem
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
    }, [mapRef.current, origem, destino]); // Dependências: re-executa se algo mudar


    // --- 3. ADICIONADO (Fallback) ---
    // Define uma região inicial (ex: centro do Brasil)
    // para o mapa não ficar em (0, 0) enquanto os dados carregam.
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
                // --- 4. ALTERADO ---
                // Removemos o onMapReady e usamos o initialRegion
                // O useEffect acima vai cuidar do foco quando os dados chegarem.
                initialRegion={initialRegion} 
            >
                {/* --- 5. ALTERADO (VALIDAÇÃO) --- */}
                {/* Só renderiza os marcadores se tiver dados */}
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

                {/* --- 6. ALTERADO (VALIDAÇÃO) --- */}
                {/* Só renderiza a rota se tiver dados */}
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
                {/* ... (Restante do seu componente sem alterações) ... */}
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
            />
        </View>
    );
}