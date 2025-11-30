import React, { useRef, useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native'; // Removido ScrollView e Polyline
import MapView, { Marker } from 'react-native-maps'; // Removido Polyline
import { Ionicons } from '@expo/vector-icons';
import styles from './style';
import { UserContext } from '../../contexts/UserContext';
import { useContext } from 'react';
import IconOrigem from '../../components/IconOrigem';
import Guincho from '../../assets/images/guincho.svg';
import ArrivalConfirmation from '../../components/ArrivalConfirmation';

import MapViewDirections from 'react-native-maps-directions';

import { io } from 'socket.io-client';
import api from '../../services/api';
import { getCallStatus } from '../../services/calls';
import { AppState } from 'react-native';

export default function CallProgress({ route, navigation }) {
    const { origem, destino, callId, guincheiroInfo } = route.params;
    const mapRef = useRef(null);
    const { user } = useContext(UserContext);
    const [distance, setDistance] = useState(null);
    const [duration, setDuration] = useState(null);
    const [chegada, setChegada] = useState(false);
    const [etapaViagem, setEtapaViagem] = useState('guincheiro_a_caminho');
    
    const [showConfirmationModal, setShowConfirmationModal] = useState(false);
    const [isEnderecoInicial, setIsEnderecoInicial] = useState(true);
    const [clienteConfirmou, setClienteConfirmou] = useState(false);
    const [guincheiroConfirmou, setGuincheiroConfirmou] = useState(false);
    const [aguardandoConfirmacao, setAguardandoConfirmacao] = useState(false);
    const isEnderecoInicialRef = useRef(true);

    const GOOGLE_MAPS_APIKEY = 'AIzaSyBkx6mo29bFuoPzoNSLpE97c8EoWptHl1M';

    const calcularDistancia = (lat1, lon1, lat2, lon2) => {
        const R = 6371; 
        const dLat = (lat2 - lat1) * (Math.PI / 180);
        const dLon = (lon2 - lon1) * (Math.PI / 180);
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c; 
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
            setGuincheiroPos({
                latitude: data.latitude,
                longitude: data.longitude
            });
        });

        socket.on('guincheiro-confirmou-chegada', (data) => {
            console.log('Motorista confirmou chegada:', data);
            setGuincheiroConfirmou(prev => {
                if ((data.tipo === 'inicial' && isEnderecoInicialRef.current) || 
                    (data.tipo === 'final' && !isEnderecoInicialRef.current)) {
                    return true;
                }
                return prev;
            });
        });

        socket.on('ambos-confirmaram', (data) => {
            console.log('Ambos confirmaram, prosseguindo:', data);
            setShowConfirmationModal(false);
            setClienteConfirmou(false);
            setGuincheiroConfirmou(false);
            setAguardandoConfirmacao(false);
            
            if (data.tipo === 'inicial') {
                setEtapaViagem('levando_ao_destino');
                setDistance(null);
            } else if (data.tipo === 'final') {
                setEtapaViagem('concluido');
                navigation.replace('CallCompleted', {
                    origem, destino, guincheiro, vehicle, callId, guincheiroInfo
                });
            }
        });

        socket.on('disconnect', () => {
            console.log('Socket desconectado (cliente)');
        });

        return () => {
            try {
                socket.disconnect();
            } catch (err) {
            }
        };
    }, [callId]);
    
    useEffect(() => {
        if (!guincheiroPos || etapaViagem === 'concluido') return;

        let distanciaCalculada = null;

        if (etapaViagem === 'guincheiro_a_caminho') {
            distanciaCalculada = calcularDistancia(
                guincheiroPos.latitude,
                guincheiroPos.longitude,
                origem.lat,
                origem.lng
            );
        } else if (etapaViagem === 'levando_ao_destino') {
            distanciaCalculada = calcularDistancia(
                guincheiroPos.latitude,
                guincheiroPos.longitude,
                destino.lat,
                destino.lng
            );
        }

        if (distanciaCalculada !== null) {
            setDistance(prevDistance => {
                if (prevDistance === null || Math.abs(prevDistance - distanciaCalculada) > 0.05) {
                    return distanciaCalculada;
                }
                return prevDistance;
            });
        }
    }, [guincheiroPos, etapaViagem, origem, destino]);


    useEffect(() => {
        if (distance === null || aguardandoConfirmacao) return;

        console.log(`[CallProgress Cliente] Distância: ${distance.toFixed(3)} km, Etapa: ${etapaViagem}`);

        const threshold = 0.1;

        if (etapaViagem === 'guincheiro_a_caminho' && distance < threshold && !showConfirmationModal) {
            console.log("✅ [Cliente] Próximo ao endereço inicial, mostrando modal de confirmação.");
            setIsEnderecoInicial(true);
            isEnderecoInicialRef.current = true;
            setShowConfirmationModal(true);
            setAguardandoConfirmacao(true);
            setClienteConfirmou(false);
            setGuincheiroConfirmou(false);
            return;
        }
        
        if (etapaViagem === 'levando_ao_destino' && distance < threshold && !showConfirmationModal) {
            console.log("✅ [Cliente] Próximo ao endereço final, mostrando modal de confirmação.");
            setIsEnderecoInicial(false);
            isEnderecoInicialRef.current = false;
            setShowConfirmationModal(true);
            setAguardandoConfirmacao(true);
            setClienteConfirmou(false);
            setGuincheiroConfirmou(false);
            return;
        }

    }, [distance, etapaViagem, showConfirmationModal, aguardandoConfirmacao]);

    useEffect(() => {
        if (!callId || etapaViagem === 'concluido') return;

        let cancelled = false;
        let delayMs = 3000; 
        const appStateRef = { current: AppState.currentState };

        const onAppStateChange = (next) => {
            appStateRef.current = next;
        };
        const sub = AppState.addEventListener('change', onAppStateChange);
        let timer = null;

        const poll = async () => {
            if (cancelled) return;
            if (appStateRef.current !== 'active') {
                timer = setTimeout(poll, 3000);
                return;
            }
            try {
                const res = await getCallStatus(callId);
                console.log(`[CallProgress Cliente] Status do chamado:`, res?.status_chamado);
                
                if (res?.status_chamado === 'concluido') {
                    cancelled = true;
                    if (timer) clearTimeout(timer);
                    
                    console.log("✅ Chamado foi finalizado pelo guincheiro!");
                    navigation.replace('CallCompleted', {
                        origem,
                        destino,
                        guincheiro,
                        vehicle,
                        callId,
                        guincheiroInfo
                    });
                    return;
                }
            } catch (e) {
                console.error("[CallProgress Cliente] Erro ao verificar status:", e);
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
    }, [callId, etapaViagem, navigation, origem, destino, guincheiro, vehicle, guincheiroInfo]);

    if (!guincheiroPos) {
        return (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <Text>Aguardando localização do guincheiro...</Text>
            </View>
        );
    }

    let rotaOrigem, rotaDestino;
    if (etapaViagem === 'guincheiro_a_caminho') {
        rotaOrigem = { latitude: guincheiroPos.latitude, longitude: guincheiroPos.longitude };
        rotaDestino = { latitude: origem.lat, longitude: origem.lng };
    } else {
        rotaOrigem = { latitude: guincheiroPos.latitude, longitude: guincheiroPos.longitude };
        rotaDestino = { latitude: destino.lat, longitude: destino.lng };
    }

    console.log()


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

    const handleCall = () => {
        console.log('Ligando para:', guincheiro.phone);
    };

    const handleChat = () => {
        navigation.navigate('Chat', { guincheiro, call });
    };

    const handleConfirmArrival = () => {
        if (!socketRef.current) return;
        
        setClienteConfirmou(true);
        
        const tipo = isEnderecoInicial ? 'inicial' : 'final';
        socketRef.current.emit('cliente-confirmou-chegada', {
            callId,
            tipo,
            userId: user?.id
        });
        
        console.log(`[Cliente] Confirmação de chegada enviada: ${tipo}`);
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
                    <Guincho width={30} height={30} />
                </Marker>

                {etapaViagem === 'guincheiro_a_caminho' ? (
                    <Marker
                        coordinate={{ latitude: origem.lat, longitude: origem.lng }}
                        title="Você"
                        description={origem.endereco}
                    >
                        <IconOrigem width={30} height={30} />
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
                
                {origem && destino && guincheiroPos && (
                    <MapViewDirections
                        key={`route-${etapaViagem}-${guincheiroPos.latitude.toFixed(4)}-${guincheiroPos.longitude.toFixed(4)}`}
                        origin={rotaOrigem}
                        destination={rotaDestino}
                        apikey={GOOGLE_MAPS_APIKEY} 
                        strokeWidth={3}
                        precision='high'
                        strokeColor={etapaViagem === 'guincheiro_a_caminho' ? "#EF8108" : "#3498DB"}
                        mode='driving'
                        onReady={result => {
                            console.log(`[CallProgress Cliente] Rota API - Dist: ${result.distance} km, Dur: ${result.duration} min`);
                            
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
                            <Text style={styles.guincheiroName}>{guincheiroInfo.nome || ''}</Text>
                            <View style={styles.ratingContainer}>
                                <Text style={styles.ratingText}>{guincheiroInfo.media_avaliacoes}★</Text>
                            </View>
                        </View>
                        <Text style={styles.guincheiroCalls}>
                            Mais de {guincheiroInfo.total_chamados_atendidos} chamados atendidos
                        </Text>
                        
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

                {!chegada ? (
                    <View style={styles.timeContainer}>
                        <Text style={styles.timeText}>
                            <Text style={styles.timeHighlight}>{guincheiroInfo.nome || 'Nome não disponível'}</Text> está a{' '}
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

            {/* Modal de Confirmação de Chegada */}
            <ArrivalConfirmation
                visible={showConfirmationModal}
                onConfirm={handleConfirmArrival}
                onClose={() => {
                    if (!aguardandoConfirmacao) {
                        setShowConfirmationModal(false);
                    }
                }}
                guincheiroInfo={guincheiroInfo}
                endereco={isEnderecoInicial ? origem : destino}
                isEnderecoInicial={isEnderecoInicial}
                vehicle={vehicle}
                clienteConfirmou={clienteConfirmou}
                guincheiroConfirmou={guincheiroConfirmou}
            />
        </View>
    );
}