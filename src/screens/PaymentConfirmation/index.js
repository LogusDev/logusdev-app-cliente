import React, { useRef, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import Button from '../../components/Button'; 
import styles from './style';
import { UserContext } from '../../contexts/UserContext';
import { useContext } from 'react';
import { getVehicles } from '../../services/registerUser';
import IconOrigem from '../../components/IconOrigem';

export default function PaymentConfirmation({ route, navigation }) {
    const { origem, destino, actualVehicle } = route.params;
    const mapRef = useRef(null);
    const { user } = useContext(UserContext);


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

        <Text style={styles.sectionTitle}>Opções de Pagamento:</Text>

        <TouchableOpacity style={{borderColor:'#EAEAEA',borderWidth:1,backgroundColor: '#fff',width:'80%',height:45,marginBottom:21,borderRadius:15,padding:20}}>
            <Text>Pix</Text>
        </TouchableOpacity>

        <TouchableOpacity style={{borderColor:'#EAEAEA',borderWidth:1,backgroundColor: '#fff',width:'80%',height:45,marginBottom:21,borderRadius:15,padding:20}}>
            <Text>DInheiro</Text>
        </TouchableOpacity>

        <TouchableOpacity style={{borderColor:'#EAEAEA',borderWidth:1,backgroundColor: '#fff',width:'80%',height:45, borderRadius:15,padding:20}}>
            <Text>Cartão</Text>
        </TouchableOpacity>

        {/* Botão Confirmar */}
        <Button text="Confirmar" onPress={() => console.log(destino)} />
        </View>
    </View>
  );
}
