import React, { useRef, useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import styles from './style';
import { UserContext } from '../../contexts/UserContext';
import { useContext } from 'react';
import IconOrigem from '../../components/IconOrigem';
import Guincho from '../../assets/images/guincho.svg';
import MapViewDirections from 'react-native-maps-directions';

export default function CallProgress({ route, navigation }) {
    const { origem, destino, callId, guincheiroInfo } = route.params;
    const mapRef = useRef(null);
    const { user } = useContext(UserContext);
    const [distance, setDistance] = useState(null);
    const [duration, setDuration] = useState(null);
    const [chegada, setChegada] = useState(false);
    const [etapaViagem, setEtapaViagem] = useState('guincheiro_a_caminho');

    const GOOGLE_API_KEY = 'AIzaSyBkx6mo29bFuoPzoNSLpE97c8EoWptHl1M'; 



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

    const pontoInicial = { latitude:-23.585560645299317, longitude: -46.68307517700226}; //itaim

    const pontoIntermediario = {latitude :-23.631670671763185, longitude: -46.78601038499403}; //rua clara muchini

    const pontoFinal = {latitude: -23.628097429242555, longitude: -46.79256090559714}; // rua angelina


    const [guincheiroPos, setGuincheiroPos] = useState(pontoInicial);


    const vehicle = {
        model: "Atego 1726",
        color: "Branco",
        brand: "Mercedes-Benz",
        year: 2010,
        dimensions: "8m x 2.60m x 4m",
        licensePlate: "ABC1D23"
    };

    
    useEffect(() => {
        if (distance === null) return;

        if (etapaViagem === 'guincheiro_a_caminho' && distance < 0.1) {
            console.log("Chegou na origem, mudando para a etapa 2.");
            setEtapaViagem('levando_ao_destino');
            setDistance(null);
        }
        
        else if (etapaViagem === 'levando_ao_destino' && distance < 0.1) {
            console.log("Chegou ao destino final! Navegando...");
            navigation.replace('CallCompleted', {
                origem, destino, guincheiro, vehicle, callId,
            });
        }

    }, [distance, etapaViagem, navigation]);



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
                
                {origem && destino && (
                    <MapViewDirections
                        key={etapaViagem}
                        origin={rotaOrigem} 
                        destination={rotaDestino}
                        apikey={GOOGLE_API_KEY}
                        strokeWidth={3}
                        precision='high'
                        strokeColor="#EF8108"
                        mode='driving'
                        onReady={result => {
                            setDistance(result.distance);
                            setDuration(result.duration);
                            mapRef.current.fitToCoordinates(result.coordinates, {
                                edgePadding: { top: 100, right: 50, bottom: 100, left: 50 },
                                animated: true
                            });
                        }}
                    />
                )}
            </MapView>

                        <TouchableOpacity
                onPress={() => {
                    console.log('Setando posição: PONTO INICIAL');
                    setGuincheiroPos(pontoInicial);
                }}
                style={{
                    position: 'absolute', top: 60, left: 20,
                    width: 80, height: 80,
                    //backgroundColor: 'rgba(0, 0, 255, 0.3)', // Cor para debug
                }}
            />

            {/* Botão 2: Define a posição INTERMEDIÁRIA (chegada no cliente) */}
            <TouchableOpacity
                onPress={() => {
                    console.log('Setando posição: PONTO INTERMEDIÁRIO');
                    setGuincheiroPos(pontoIntermediario);
                }}
                style={{
                    position: 'absolute', top: 60, alignSelf: 'center',
                    width: 80, height: 80,
                    //backgroundColor: 'rgba(0, 255, 0, 0.3)', // Cor para debug
                }}
            />

            {/* Botão 3: Define a posição FINAL (chegada no destino) */}
            <TouchableOpacity
                onPress={() => {
                    console.log('Setando posição: PONTO FINAL');
                    setGuincheiroPos(pontoFinal);
                }}
                style={{
                    position: 'absolute', top: 60, right: 20,
                    width: 80, height: 80,
                    //backgroundColor: 'rgba(255, 0, 0, 0.3)', // Cor para debug
                }}
            />

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
                        <Text style={styles.timeHighlight}>{Math.ceil(duration)}</Text> minutos do local destinado
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