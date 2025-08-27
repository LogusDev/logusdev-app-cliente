import React, { useRef, useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import Button from '../../components/Button'; 
import styles from './style';
import { UserContext } from '../../contexts/UserContext';
import { useContext } from 'react';
import { getVehicles } from '../../services/registerUser';
import IconOrigem from '../../components/IconOrigem';
import socket, { offEvent, onEvent } from '../../services/socket';

export default function CallConfirmation({ route, navigation }) {
    const { origem, destino, veiculo } = route.params;
    const mapRef = useRef(null);
    const { user } = useContext(UserContext);
    const [actualVehicle, setActualVehicles] = useState();


    const fetchVehicles = async () => {
        try {
            const vehicle = await getVehicles(user.id);
            setActualVehicles(vehicle);
        } catch (error) {
            console.error('Erro ao buscar veículos:', error);
        }
    };

    useEffect(() => {
        fetchVehicles();
    }, []);

    
    useEffect(() => {
      function handleRideStatusUpdate(data) {
          console.log("Atualização de status da corrida:", data);
      }

      onEvent("rideStatusUpdate", handleRideStatusUpdate);

      return () => {
          offEvent("rideStatusUpdate", handleRideStatusUpdate);
      };
    }, []);


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
      </MapView>

      {/* DADOS CONFIRMADOS */}
      <View style={styles.infoContainer}>
        <Text style={styles.sectionTitle}>Confirme as informações:</Text>

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

        {/* Linha de separação */}
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

        {/* Linha de separação */}
        <View style={styles.separatorLine} />

        {/* Veículo */}
        <View style={styles.infoItem}>
            <Ionicons name="car-sport" size={24} color="#FFA500" style={styles.infoIcon} />
            <View style={styles.textContainer}>
            <Text style={styles.placeTitle}>{actualVehicle?.modelo}</Text>
            <Text style={styles.placeAddress}>{actualVehicle?.marca} • {actualVehicle?.ano_fabricacao}</Text>
            </View>
        </View>

        {/* Botão Confirmar */}
        <Button text="Confirmar" onPress={() => {
          socket.emit("new_ticket", {
            clientId: user.id,
            origem,
            destino,
            veiculo: actualVehicle,
            status: "pendente",
          });
          navigation.navigate('PaymentConfirmation', { origem, destino, actualVehicle })}} />
        </View>
    </View>
  );
}
