import React, { useRef, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import Button from '../../components/Button'; 
import styles from './style';
import { UserContext } from '../../contexts/UserContext';
import { useContext } from 'react';
import { getVehicles } from '../../services/services';
import IconOrigem from '../../components/IconOrigem';
import socket from '../../services/socket';
import { createCall } from '../../services/calls';

export default function PaymentConfirmation({ route, navigation }) {
    const { origem, destino, actualVehicle } = route.params;
    const mapRef = useRef(null);
    const { user } = useContext(UserContext);
    const [metodoPagamento, setMetodoPagamento] = useState("pix");

    const [pix, setPix] = useState(false);
    const [dinheiro, setDinheiro] = useState(false);
    const [cartao, setCartao] = useState(false);

    const [selectedPayment, setSelectedPayment] = useState(null);
    
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

    const handlePaymentConfirmation = () => {
      socket.emit("ticket_paid", {
        clienteId: user.id,
        origem,
        destino,
        veiculo: actualVehicle,
        metodoPagamento: metodoPagamento,
        status: "pago"
      })

      console.log("Pagamento enviado com o método: ", metodoPagamento);
    } 

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

        <TouchableOpacity style={{borderColor:'#EAEAEA',borderWidth:1,backgroundColor: '#fff',width:'80%',height:45,marginBottom:21,borderRadius:15,padding:20}} onPress={() => setMetodoPagamento("pix")}>
            <Text>Pix</Text>
        </TouchableOpacity>

        <TouchableOpacity style={{borderColor:'#EAEAEA',borderWidth:1,backgroundColor: '#fff',width:'80%',height:45,marginBottom:21,borderRadius:15,padding:20}} onPress={() => setMetodoPagamento("dinheiro")}>
            <Text>DInheiro</Text>
        </TouchableOpacity>

        <TouchableOpacity style={{borderColor:'#EAEAEA',borderWidth:1,backgroundColor: '#fff',width:'80%',height:45, borderRadius:15,padding:20}} onPress={() => setMetodoPagamento("cartao")}>
            <Text>Cartão</Text>
        </TouchableOpacity>

        {/* Botão Confirmar */}
        <Button text="Confirmar" onPress={() => {
          handlePaymentConfirmation();
          console.log(destino)} 
        } />
        <TouchableOpacity style={styles.paymentOption}>
            <Text style={styles.paymentOptionText}>Pix</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.paymentOption}>
            <Text style={styles.paymentOptionText}>Dinheiro</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.paymentOption}>
            <Text style={styles.paymentOptionText}>Cartão</Text>
        </TouchableOpacity>

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
