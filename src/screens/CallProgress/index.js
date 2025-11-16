import React, { useRef, useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native'; // Removido ScrollView e Polyline
import MapView, { Marker } from 'react-native-maps'; // Removido Polyline
import { Ionicons } from '@expo/vector-icons';
import styles from './style';
import { UserContext } from '../../contexts/UserContext';
import { useContext } from 'react';
import IconOrigem from '../../components/IconOrigem';
import Guincho from '../../assets/images/guincho.svg';

// --- MUDANÇA PRINCIPAL: IMPORTANDO A BIBLIOTECA IGUAL AO GUINCHEIRO ---
import MapViewDirections from 'react-native-maps-directions';

import { io } from 'socket.io-client';
import api from '../../services/api';

export default function CallProgress({ route, navigation }) {
    const { origem, destino, callId, guincheiroInfo } = route.params;
    const mapRef = useRef(null);
    const { user } = useContext(UserContext);
    const [distance, setDistance] = useState(null);
    const [duration, setDuration] = useState(null);
    const [chegada, setChegada] = useState(false);
    const [etapaViagem, setEtapaViagem] = useState('guincheiro_a_caminho');

    // --- MUDANÇA: Renomeado para consistência com o app do guincheiro ---
    const GOOGLE_MAPS_APIKEY = 'AIzaSyBkx6mo29bFuoPzoNSLpE97c8EoWptHl1M';

    // Função para calcular distância entre duas coordenadas (Haversine) - IDÊNTICA
    const calcularDistancia = (lat1, lon1, lat2, lon2) => {
        const R = 6371; // Raio da Terra em km
        const dLat = (lat2 - lat1) * (Math.PI / 180);
        const dLon = (lon2 - lon1) * (Math.PI / 180);
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c; // Distância em km
    };

    console.log('guincheiroInfo', guincheiroInfo?.nome, guincheiroInfo?.foto_url)

    const guincheiro = {
        name: guincheiroInfo?.nome || "Bob Santos",
        calls: 1593,
        rating: 4.9,
        phone: guincheiroInfo?.telefone || "123-456-7890",
        photo: guincheiroInfo?.foto_url || "https://fielmanchete.com/storage/media-items/imagens/2025/04/craque-neto_20250405051606.webp",
        latitude: -23.628097429242555,
        longitude: -46.79256090559714
    };

    // Posição do guincheiro recebida via Socket.IO
    const [guincheiroPos, setGuincheiroPos] = useState(null);
    const socketRef = useRef(null);


    const vehicle = {
        model: "Atego 1726",
        color: "Branco",
        brand: "Mercedes-Benz",
        year: 2010,
        dimensions: "8m x 2.60m x 4m",
        licensePlate: "ABC1D23"
    };

    // -------------------------
    // --- REMOVIDO: Wrapper MapViewDirections customizado, decodePolyline, getRouteFromGoogleV2 ---
    // -------------------------

    // CONFIGURAÇÃO DO SOCKET.IO (Idêntico)
    useEffect(() => {
        if (!callId) return;

        const socket = io(api.defaults.baseURL, {
            transports: ['websocket', 'polling']
        });

        socketRef.current = socket;

        socket.on('connect', () => {
            console.log('Socket conectado (cliente):', socket.id);
            socket.emit('join-call-room', callId);
        });

        socket.on('guincheiro-location-update', (data) => {
            // console.log('Localização do guincheiro recebida:', data); // Log pode ser muito verboso
            setGuincheiroPos({
                latitude: data.latitude,
                longitude: data.longitude
            });
        });

        socket.on('disconnect', () => {
            console.log('Socket desconectado (cliente)');
        });

        return () => {
            try {
                socket.disconnect();
            } catch (err) {
                // ignore
            }
        };
    }, [callId]);
    
    // --- LÓGICA DE CÁLCULO MANUAL IDÊNTICA À DO GUINCHEIRO ---
    // Verifica distância manualmente quando a posição do guincheiro muda
    useEffect(() => {
        if (!guincheiroPos || etapaViagem === 'concluido') return;

        let distanciaCalculada = null;

        if (etapaViagem === 'guincheiro_a_caminho') {
            // Distância do guincheiro até o cliente (origem)
            distanciaCalculada = calcularDistancia(
                guincheiroPos.latitude,
                guincheiroPos.longitude,
                origem.lat,
                origem.lng
            );
        } else if (etapaViagem === 'levando_ao_destino') {
            // Distância do guincheiro até o destino
            distanciaCalculada = calcularDistancia(
                guincheiroPos.latitude,
                guincheiroPos.longitude,
                destino.lat,
                destino.lng
            );
        }

        if (distanciaCalculada !== null) {
            // console.log(`[CallProgress Cliente] Distância calculada manualmente: ${distanciaCalculada.toFixed(3)} km`);
            // Atualiza a distância (lógica idêntica à do guincheiro, com filtro de 0.05km)
            setDistance(prevDistance => {
                if (prevDistance === null || Math.abs(prevDistance - distanciaCalculada) > 0.05) {
                    return distanciaCalculada;
                }
                return prevDistance;
            });
        }
    }, [guincheiroPos, etapaViagem, origem, destino]);


    // --- LÓGICA DE MUDANÇA DE ETAPA IDÊNTICA À DO GUINCHEIRO ---
    useEffect(() => {
        if (distance === null) return;

        console.log(`[CallProgress Cliente] Distância: ${distance.toFixed(3)} km, Etapa: ${etapaViagem}`);

        // 0.2 km = 200 metros - threshold idêntico
        const threshold = 0.2;

        if (etapaViagem === 'guincheiro_a_caminho' && distance < threshold) {
            console.log("✅ [Cliente] Chegou na origem, mudando para a etapa 2 (destino).");
            setEtapaViagem('levando_ao_destino');
            setDistance(null); // Reseta a distância para o próximo cálculo de etapa
            return;
        }
        
        if (etapaViagem === 'levando_ao_destino' && distance < threshold) {
            console.log("✅ [Cliente] Chegou ao destino final! Navegando para CallCompleted...");
            setEtapaViagem('concluido'); // Previne múltiplas navegações
            navigation.replace('CallCompleted', {
                origem, destino, guincheiro, vehicle, callId,
            });
        }

    }, [distance, etapaViagem, navigation, origem, destino]);

    // Aguarda a posição do guincheiro ser recebida via Socket.IO
    if (!guincheiroPos) {
        return (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <Text>Aguardando localização do guincheiro...</Text>
            </View>
        );
    }

    // Lógica de definição de rota idêntica
    let rotaOrigem, rotaDestino;
    if (etapaViagem === 'guincheiro_a_caminho') {
        rotaOrigem = { latitude: guincheiroPos.latitude, longitude: guincheiroPos.longitude };
        rotaDestino = { latitude: origem.lat, longitude: origem.lng };
    } else {
        rotaOrigem = { latitude: guincheiroPos.latitude, longitude: guincheiroPos.longitude };
        rotaDestino = { latitude: destino.lat, longitude: destino.lng };
    }


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

    const call = {
        distance: "11 minutos"
    };

    const handleCall = () => {
        console.log('Ligando para:', guincheiro.phone);
    };

    const handleChat = () => {
        navigation.navigate('Chat', { guincheiro, call });
    };

    return (
        <View style={styles.container}>
            <MapView
                provider="google"
                ref={mapRef}
                style={styles.map}
                onMapReady={onMapReady}
                showsBuildings={true}
                initialRegion={{
                    latitude: origem.lat,
                    longitude: origem.lng,
                    latitudeDelta: 0.05,
                    longitudeDelta: 0.05,
                }}
            >
                <Marker
                    coordinate={{ latitude: guincheiroPos.latitude, longitude: guincheiroPos.longitude }}
                    title="Guincheiro"
                    anchor={{ x: 0.5, y: 0.5 }}
                >
                    <Guincho width={35} height={35} />
                </Marker>

                {etapaViagem === 'guincheiro_a_caminho' ? (
                    <Marker
                        coordinate={{ latitude: origem.lat, longitude: origem.lng }}
                        title="Você"
                        description={origem.endereco}
                    >
                        <IconOrigem width={35} height={35} />
                    </Marker>
                ) : (
                    <Marker
                        coordinate={{ latitude: destino.lat, longitude: destino.lng }}
                        title="Destino final"
                        description={destino.endereco}
                    >
                        <Ionicons name="flag" size={30} color="#3498db" />
                    </Marker>
                )}
                
                {/* --- MUDANÇA: USANDO O COMPONENTE DA BIBLIOTECA, IGUAL AO GUINCHEIRO --- */}
                {origem && destino && guincheiroPos && (
                    <MapViewDirections
                        key={`route-${etapaViagem}-${guincheiroPos.latitude.toFixed(4)}-${guincheiroPos.longitude.toFixed(4)}`}
                        origin={rotaOrigem}
                        destination={rotaDestino}
                        apikey={GOOGLE_MAPS_APIKEY} // Usando a chave
                        strokeWidth={3}
                        precision='high'
                        // Cor da rota idêntica à do guincheiro (muda de cor por etapa)
                        strokeColor={etapaViagem === 'guincheiro_a_caminho' ? "#EF8108" : "#3498DB"}
                        mode='driving'
                        onReady={result => {
                            console.log(`[CallProgress Cliente] Rota API - Dist: ${result.distance} km, Dur: ${result.duration} min`);
                            
                            // Define a distância e duração primariamente pela API
                            if (result.distance && result.distance > 0) {
                                setDistance(result.distance);
                                setDuration(result.duration);
                            }
                            
                            if (mapRef.current && result.coordinates?.length > 0) {
                                mapRef.current.fitToCoordinates(result.coordinates, {
                                    edgePadding: { top: 100, right: 50, bottom: 100, left: 50 },
                                    animated: true
                                });
                            }
                        }}
                        onError={(errorMessage) => {
                            // Se a API falhar, o cálculo manual no useEffect servirá como fallback
                            console.warn('[CallProgress Cliente] Erro API Directions (fallback p/ manual):', errorMessage);
                        }}
                    />
                )}
            </MapView>

            <View style={styles.infoContainer}>
                <Text style={styles.sectionTitle}>Situação do chamado:</Text>

                {/* GUINCHEIRO */}
                <View style={styles.guincheiroContainer}>
                    <Image
                        style={styles.guincheiroImage}
                        source={{ uri: guincheiro.photo }}
                    />
                    <View style={styles.guincheiroInfo}>
                        <View style={styles.nameRatingRow}>
                            <Text style={styles.guincheiroName}>{guincheiro.name || ''}</Text>
                            <View style={styles.ratingContainer}>
                                <Text style={styles.ratingText}>{guincheiro.rating}★</Text>
                            </View>
                        </View>
                        <Text style={styles.guincheiroCalls}>
                            Mais de {guincheiro.calls} chamados atendidos
                        </Text>
                        
                        {/* INFORMAÇÕES DO VEÍCULO DENTRO DO MESMO CONTAINER */}
                        <View style={styles.vehicleInfoInline}>
                            <View style={styles.vehicleTextContainer}>
                                <Text style={styles.vehicleModel}>
                                    {vehicle.model} - {vehicle.color}
                                </Text>
                                <Text style={styles.vehicleDetails}>
                                    {vehicle.brand} {vehicle.year} - {vehicle.dimensions}
                                </Text>
                                <Text style={styles.licensePlate}>
                                    Placa: {vehicle.licensePlate}
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>

                <View style={styles.separatorLine} />

                {/* TEMPO ESTIMADO */}
                {!chegada ? (
                    <View style={styles.timeContainer}>
                        <Text style={styles.timeText}>
                            <Text style={styles.timeHighlight}>{guincheiro.name || 'Nome não disponível'}</Text> está a{' '}
                            <Text style={styles.timeHighlight}>{duration ? Math.ceil(duration) : '—'}</Text> minutos do local destinado
                        </Text>
                    </View>
                ) : (
                    <View style={styles.timeContainer}>
                        <Text style={styles.timeText}>
                            <Text style={styles.timeHighlight}>{guincheiro.name || 'Nome não disponível'}</Text>{' '}
                            chegou ao local destinado!
                        </Text>
                    </View>
                )}

                {/* BOTÕES DE COMUNICAÇÃO */}
                <View style={styles.communicationContainer}>
                    <TouchableOpacity
                        style={[styles.communicationButton, styles.phoneButton]}
                        onPress={handleCall}
                    >
                        <Ionicons name="call" size={24} color="#4a4a4a" />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.communicationButton, styles.chatButton]}
                        onPress={handleChat}
                    >
                        <Ionicons name="chatbubble-ellipses" size={24} color="#4a4a4a" />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}