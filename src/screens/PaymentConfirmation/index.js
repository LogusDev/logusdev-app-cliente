import React, { useRef, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import Button from '../../components/Button'; 
import styles from './style';
import { UserContext } from '../../contexts/UserContext';
import { useContext } from 'react';
import { getVehicles } from '../../services/services';
import IconOrigem from '../../components/IconOrigem';
import { createCall, priceCalc } from '../../services/calls';

export default function PaymentConfirmation({ route, navigation }) {
    const { origem, destino, actualVehicle } = route.params;
    const mapRef = useRef(null);
    const { user } = useContext(UserContext);

    const [pix, setPix] = useState(false);
    const [dinheiro, setDinheiro] = useState(false);
    const [cartao, setCartao] = useState(false);

    const [selectedPayment, setSelectedPayment] = useState(null);

    const [preco, setPreco] = useState(null);

    useEffect(() => {
      async function loadPrice() {
        const p = await priceCalc(origem, destino);
        setPreco(p);
      }
      loadPrice();
    }, []);


    console.log(origem)


    const handlePaymentSelection = () => {
      if (selectedPayment === 'pix') {
        setSelectedPayment(null);
        setPix(false);
      } else {
        setSelectedPayment('pix');
        setPix(true);
        setDinheiro(false);
        setCartao(false);
      }

      if (selectedPayment === 'dinheiro') {
        setSelectedPayment(null);
        setDinheiro(false);
      } else {
        setSelectedPayment('dinheiro');
        setDinheiro(true);
        setPix(false);
        setCartao(false);
      }
      if (selectedPayment === 'cartao') {
        setSelectedPayment(null);
        setCartao(false);
      } else {
        setSelectedPayment('cartao');
        setCartao(true);
        setDinheiro(false);
        setPix(false);
      }
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

        <TouchableOpacity
          style={[
            styles.paymentOption,
            selectedPayment === 'pix' && { borderColor: '#EF8108', borderWidth: 2 }
          ]}
          onPress={() => setSelectedPayment('pix')}
        >
          <Text style={styles.paymentOptionText}>Pix</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.paymentOption,
            selectedPayment === 'dinheiro' && { borderColor: '#EF8108', borderWidth: 2 }
          ]}
          onPress={() => setSelectedPayment('dinheiro')}
        >
          <Text style={styles.paymentOptionText}>Dinheiro</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.paymentOption,
            selectedPayment === 'cartao' && { borderColor: '#EF8108', borderWidth: 2 }
          ]}
          onPress={() => setSelectedPayment('cartao')}
        >
          <Text style={styles.paymentOptionText}>Cartão</Text>
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>Valor aproximado:</Text>

        {preco === null ? (
          <ActivityIndicator color="#FFA500" />
        ) : (
          <Text style={{ fontSize: 28, fontWeight: 'bold', color: "#1B5E20" }}>
            R$ {preco.toFixed(2)}
          </Text>
        )}


        {/* Botão Buscar */}
        <Button
          text="Buscar"
          onPress={async () => {
            try {
              const payload = {
                latitude_inicial: origem.lat,
                longitude_inicial: origem.lng,
                latitude_final: destino.lat,
                longitude_final: destino.lng,
                descricao: 'Chamado via app',
                carro_id: actualVehicle?.id,
                cliente_id: user?.id,
                metodo_pagamento: selectedPayment,
              };
              const novo = await createCall(payload);
              navigation.navigate('SearchCall', { origem, destino, actualVehicle, callId: novo.id });
            } catch (e) {
              alert('Não foi possível criar o chamado. Tente novamente.');
            }
          }}
        />
      </View>
    </View>
  );
}
