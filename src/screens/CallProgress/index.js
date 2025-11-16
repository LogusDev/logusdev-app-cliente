import React, { useRef, useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import styles from './style';
import { UserContext } from '../../contexts/UserContext';
import { useContext } from 'react';
import IconOrigem from '../../components/IconOrigem';
import Guincho from '../../assets/images/guincho.svg';
/* Mantive a import do pacote original caso você queira voltar a usar,
   mas o componente local MapViewDirections (abaixo) irá sobrescrever
   esse nome no escopo e será usado no JSX. */
import MapViewDirectionsLegacy from 'react-native-maps-directions';
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

    const GOOGLE_API_KEY = 'AIzaSyBkx6mo29bFuoPzoNSLpE97c8EoWptHl1M'; 

    // Função para calcular distância entre duas coordenadas (Haversine)
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

    console.log('guincheiroInfo', guincheiroInfo?.nome)

    const guincheiro = {
        name: guincheiroInfo?.nome || "Bob Santos",
        calls: 1593,
        rating: 4.9,
        phone: guincheiroInfo?.telefone || "123-456-7890",
        photo: "https://fielmanchete.com/storage/media-items/images/2025/04/craque-neto_20250405051606.webp",
        latitude: -23.628097429242555,
        longitude: -46.79256090559714
    };

    // Estado inicial da posição do guincheiro (será atualizado via Socket.IO)
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
    // Wrapper MapViewDirections (substitui o uso de react-native-maps-directions)
    // Usa Google Routes API v2 por baixo e expõe handlers onReady/onError compatíveis.
    // -------------------------
    function decodePolyline(encoded) {
        // Decodificador clássico de polyline (precision 5)
        let points = [];
        let index = 0;
        let lat = 0;
        let lng = 0;

        while (index < encoded.length) {
            let result = 0;
            let shift = 0;
            let b;
            do {
                b = encoded.charCodeAt(index++) - 63;
                result |= (b & 0x1f) << shift;
                shift += 5;
            } while (b >= 0x20);
            const dlat = ((result & 1) ? ~(result >> 1) : (result >> 1));
            lat += dlat;

            result = 0;
            shift = 0;
            do {
                b = encoded.charCodeAt(index++) - 63;
                result |= (b & 0x1f) << shift;
                shift += 5;
            } while (b >= 0x20);
            const dlng = ((result & 1) ? ~(result >> 1) : (result >> 1));
            lng += dlng;

            points.push({ latitude: lat / 1e5, longitude: lng / 1e5 });
        }

        return points;
    }

    async function getRouteFromGoogleV2(origin, destination, apiKey, signal) {
        // origin/destination: { latitude, longitude }
        const body = {
            origin: { location: { latLng: { latitude: origin.latitude, longitude: origin.longitude } } },
            destination: { location: { latLng: { latitude: destination.latitude, longitude: destination.longitude } } },
            travelMode: "DRIVE",
            routingPreference: "TRAFFIC_AWARE"
        };

        const res = await fetch("https://routes.googleapis.com/directions/v2:computeRoutes", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-Goog-Api-Key": apiKey,
                // FieldMask '*' para retornar o máximo; pode ajustar se preferir
                "X-Goog-FieldMask": "routes.polyline,routes.distanceMeters,routes.duration,routes.routeToken,routes.legs",
            },
            body: JSON.stringify(body),
            signal
        });

        if (!res.ok) {
            const text = await res.text().catch(() => '');
            throw new Error(`Google Routes API error: ${res.status} ${res.statusText} ${text}`);
        }

        const json = await res.json();
        return json;
    }

    // Componente local com mesma "API" do MapViewDirections que você já usava.
    // Props principais suportados: origin, destination, apikey, onReady, onError, strokeWidth, strokeColor, mode
    function MapViewDirections({ origin, destination, apikey, onReady, onError, strokeWidth = 3, strokeColor = '#EF8108' }) {
        const [coords, setCoords] = useState(null);
        const abortControllerRef = useRef(null);

        useEffect(() => {
            // reinicia quando origin/destination mudam
            if (!origin || !destination) return;
            abortControllerRef.current?.abort();
            const c = new AbortController();
            abortControllerRef.current = c;

            (async () => {
                try {
                    const payload = await getRouteFromGoogleV2(
                        { latitude: origin.latitude, longitude: origin.longitude },
                        { latitude: destination.latitude, longitude: destination.longitude },
                        apikey,
                        c.signal
                    );

                    // A resposta tem estrutura: payload.routes[0].polyline.encodedPolyline (em muitos casos)
                    const route = payload?.routes?.[0];
                    if (!route) {
                        throw new Error('No routes returned from Google Routes API');
                    }

                    // Try common fields for polyline
                    let encoded = route?.polyline?.encodedPolyline || route?.polyline?.[0]?.encodedPolyline || null;

                    // Some responses include a 'routeToken' and 'legs' - try to extract geometry from legs
                    if (!encoded && route?.legs && route.legs.length > 0) {
                        // concatenate encodedPolylines of legs if exist
                        for (const leg of route.legs) {
                            if (leg?.polyline?.encodedPolyline) {
                                encoded = encoded ? (encoded + leg.polyline.encodedPolyline) : leg.polyline.encodedPolyline;
                            }
                        }
                    }

                    if (!encoded) {
                        // fallback: try to build coords from legs steps if present
                        const leg = route.legs?.[0];
                        if (leg && leg.steps) {
                            // each step may have polyline
                            let all = [];
                            for (const step of leg.steps) {
                                if (step.polyline?.encodedPolyline) {
                                    const dec = decodePolyline(step.polyline.encodedPolyline);
                                    all = all.concat(dec);
                                }
                            }
                            if (all.length > 0) {
                                setCoords(all);
                                // compute distance/duration from route fields if available
                                const distanceMeters = route.distanceMeters || (leg.distanceMeters) || null;
                                const durationSeconds = route.duration || (leg.duration) || null;
                                onReady && onReady({
                                    distance: distanceMeters ? (distanceMeters / 1000) : null,
                                    duration: durationSeconds ? (durationSeconds / 60) : null,
                                    coordinates: all
                                });
                                return;
                            }
                        }

                        throw new Error('No polyline found in Routes API response');
                    }

                    const decoded = decodePolyline(encoded || '');
                    setCoords(decoded);

                    const distanceMeters = route.distanceMeters || (route.legs?.[0]?.distanceMeters) || null;
                    const durationSeconds = route.duration || (route.legs?.[0]?.durationSeconds) || null;

                    onReady && onReady({
                        distance: distanceMeters ? (distanceMeters / 1000) : null,
                        duration: durationSeconds ? (durationSeconds / 60) : null,
                        coordinates: decoded
                    });
                } catch (err) {
                    if (err.name === 'AbortError') return;
                    console.error('[MapViewDirections wrapper] error', err);
                    try {
                        onError && onError(err.message || err);
                    } catch (e) {
                        console.error(e);
                    }
                }
            })();

            return () => {
                abortControllerRef.current?.abort();
            };
        }, [origin?.latitude, origin?.longitude, destination?.latitude, destination?.longitude, apikey]);

        if (!coords || coords.length === 0) return null;

        return (
            <Polyline
                coordinates={coords}
                strokeWidth={strokeWidth}
                strokeColor={strokeColor}
            />
        );
    }
    // -------------------------
    // Fim do wrapper MapViewDirections
    // -------------------------

    // CONFIGURAÇÃO DO SOCKET.IO PARA RECEBER LOCALIZAÇÃO DO GUINCHEIRO
    useEffect(() => {
        if (!callId) return;

        // Conecta ao servidor Socket.IO
        const socket = io(api.defaults.baseURL, {
            transports: ['websocket', 'polling']
        });

        socketRef.current = socket;

        // Entra na sala do chamado
        socket.on('connect', () => {
            console.log('Socket conectado (cliente):', socket.id);
            socket.emit('join-call-room', callId);
        });

        // Recebe atualizações de localização do guincheiro
        socket.on('guincheiro-location-update', (data) => {
            console.log('Localização do guincheiro recebida:', data);
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
    
    // ---------- CORREÇÃO: Sempre recalcula a distância manual quando a posição do guincheiro muda ----------
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
            console.log(`[CallProgress Cliente] Distância calculada manualmente: ${distanciaCalculada.toFixed(3)} km`);
            // Atualiza sempre a distância (removido filtro que bloqueava pequenas variações)
            setDistance(distanciaCalculada);
        }
    }, [guincheiroPos, etapaViagem, origem, destino]);

    // ---------- CORREÇÃO: useEffect que decide mudança de etapa baseado na distance ----------
    useEffect(() => {
        if (distance === null) return;

        console.log(`[CallProgress Cliente] Distância: ${distance.toFixed(3)} km, Etapa: ${etapaViagem}`);

        // 0.2 km = 200 metros - threshold para considerar chegada
        const threshold = 0.2;

        if (etapaViagem === 'guincheiro_a_caminho' && distance < threshold) {
            console.log("✅ Chegou na origem (cliente), mudando para a etapa 2 (destino).");
            setEtapaViagem('levando_ao_destino');
            setDistance(null);
            return;
        }
        
        if (etapaViagem === 'levando_ao_destino' && distance < threshold) {
            console.log("✅ Chegou ao destino final! Navegando para CallCompleted...");
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

    let rotaOrigem, rotaDestino;

    if (etapaViagem === 'guincheiro_a_caminho') {
        rotaOrigem = { latitude: guincheiroPos.latitude, longitude: guincheiroPos.longitude };
        rotaDestino = { latitude: origem.lat, longitude: origem.lng };
        console.log(callId);
        console.log(etapaViagem);
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
        // Implementar chamada telefônica
        console.log('Ligando para:', guincheiro.phone);
    };

    const handleChat = () => {
        // Navegar para tela de chat
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
                
                {origem && destino && guincheiroPos && (
                    <MapViewDirections
                        key={`route-${etapaViagem}-${guincheiroPos.latitude}-${guincheiroPos.longitude}`}
                        origin={rotaOrigem} 
                        destination={rotaDestino}
                        apikey={GOOGLE_API_KEY}
                        strokeWidth={3}
                        precision='high'
                        strokeColor="#EF8108"
                        mode='driving'
                        onReady={result => {
                            console.log(`[CallProgress Cliente] Rota calculada - Distância: ${result.distance} km, Duração: ${result.duration} min`);
                            // quando disponível, priorizamos a distância/duração da API
                            if (result.distance && result.distance > 0) setDistance(result.distance);
                            if (result.duration && result.duration > 0) setDuration(result.duration);
                            if (mapRef.current && result.coordinates?.length > 0) {
                                mapRef.current.fitToCoordinates(result.coordinates, {
                                    edgePadding: { top: 100, right: 50, bottom: 100, left: 50 },
                                    animated: true
                                });
                            }
                        }}
                        onError={(errorMessage) => {
                            console.error('[CallProgress Cliente] Erro ao calcular rota:', errorMessage);
                            // Se a rota do Google falhar (ex.: legacy API), usamos cálculo manual como fallback
                            if (guincheiroPos) {
                                const manualDist = (etapaViagem === 'guincheiro_a_caminho')
                                    ? calcularDistancia(guincheiroPos.latitude, guincheiroPos.longitude, origem.lat, origem.lng)
                                    : calcularDistancia(guincheiroPos.latitude, guincheiroPos.longitude, destino.lat, destino.lng);

                                console.log(`[CallProgress Cliente] Fallback distância manual: ${manualDist.toFixed(3)} km`);
                                setDistance(manualDist);
                                setDuration(null);
                            }
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
                {!chegada ?(
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
