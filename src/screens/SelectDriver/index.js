import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import styles from './styles';
import IconOrigem from '../../components/IconOrigem';
import { getAvailableDrivers, chooseDriver } from '../../services/calls';

export default function SelectDriver({ route, navigation }) {
  const { origem, destino, actualVehicle, callId } = route.params;
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selecting, setSelecting] = useState(false);

  useEffect(() => {
    loadDrivers();
  }, []);

  const loadDrivers = async () => {
    try {
      setLoading(true);
      const data = await getAvailableDrivers(callId);
      setDrivers(data || []);
    } catch (error) {
      console.error('Erro ao carregar guincheiros:', error);
      Toast.show({
        type: 'error',
        text1: 'Erro',
        text2: 'Não foi possível carregar os guincheiros disponíveis.',
        position: 'bottom',
        visibilityTime: 2000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSelectDriver = async (guincheiroId) => {
    try {
      setSelecting(true);
      const response = await chooseDriver(callId, guincheiroId);
      
      const selectedDriver = drivers.find(d => d.id === guincheiroId);
      
      const guincheiroInfo = {
        id: selectedDriver?.id,
        nome: selectedDriver?.nome,
        foto_url: selectedDriver?.foto_url,
        telefone: response?.chamado?.guincheiro?.telefone,
        media_avaliacoes: selectedDriver?.avaliacao || 0,
        total_chamados_atendidos:  0, 
        guincho: selectedDriver?.guincho
      };
      
      navigation.replace('WaitingDriverResponse', {
        origem,
        destino,
        actualVehicle,
        callId,
        guincheiroInfo,
        selectedDriverId: guincheiroId
      });
    } catch (error) {
      console.error('Erro ao escolher guincheiro:', error);
      Toast.show({
        type: 'error',
        text1: 'Erro',
        text2: 'Não foi possível escolher este guincheiro. Tente novamente.',
        position: 'bottom',
        visibilityTime: 2000,
      });
    } finally {
      setSelecting(false);
    }
  };

  const formatPrice = (price) => {
    if (typeof price !== 'number' || isNaN(price)) return 'R$ 0,00';
    return `R$ ${price.toFixed(2).replace('.', ',')}`;
  };

  const safeFixed = (value, digits = 1) => {
    return typeof value === 'number' && !isNaN(value) ? value.toFixed(digits) : '0.0';
  };


  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
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
            pinColor="green"
          >
            <IconOrigem width={31} height={31} />
          </Marker>
        )}
        {destino?.lat && destino?.lng && (
          <Marker
            coordinate={{ latitude: destino.lat, longitude: destino.lng }}
            title="Destino"
            pinColor="red"
          >
            <IconOrigem width={31} height={31} />
          </Marker>
        )}
      </MapView>

      {/* Lista de Guincheiros */}
      <View style={styles.driversContainer}>
        <Text style={styles.sectionTitle}>Guincheiros disponíveis:</Text>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#EF8108" />
            <Text style={styles.loadingText}>Carregando guincheiros...</Text>
          </View>
        ) : drivers.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Nenhum guincheiro disponível no momento.</Text>
          </View>
        ) : (
          <ScrollView 
            style={styles.driversList}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.driversListContent}
          >
            {drivers.map((driver, index) => (
              <TouchableOpacity
                key={driver.id}
                style={styles.driverCard}
                onPress={() => !selecting && handleSelectDriver(driver.id)}
                disabled={selecting}
                activeOpacity={0.7}
              >
                {/* Avatar e Nome */}
                <View style={styles.driverHeader}>
                  {driver.foto_url ? (
                    <Image source={{ uri: driver.foto_url }} style={styles.avatar} />
                  ) : (
                    <View style={styles.avatarPlaceholder}>
                      <Ionicons name="person" size={30} color="#666" />
                    </View>
                  )}
                  <View style={styles.driverInfo}>
                    <Text style={styles.driverName}>{driver.nome}</Text>
                    <View style={styles.ratingContainer}>
                      <Ionicons name="star" size={16} color="#FFD700" />
                      <Text style={styles.ratingText}>{driver.avaliacao.toFixed(1)}</Text>
                    </View>
                  </View>
                </View>

                {/* Valores */}
                <View style={styles.pricingContainer}>
                  <View style={styles.priceItem}>
                    <Text style={styles.priceLabel}>Saída:</Text>
                    <Text style={styles.priceValue}>{formatPrice(driver.valorSaida)}</Text>
                  </View>
                  <View style={styles.priceItem}>
                    <Text style={styles.priceLabel}>Km:</Text>
                    <Text style={styles.priceValue}>{formatPrice(driver.valorKm)}</Text>
                  </View>
                  <View style={styles.priceItem}>
                    <Text style={styles.priceLabel}>Aproximado:</Text>
                    <Text style={styles.priceValueBold}>{formatPrice(driver.precoAproximado)}</Text>
                  </View>
                </View>

                {/* Informações do Guincho */}
                <View style={styles.vehicleInfo}>
                  <Text style={styles.vehicleText}>
                    {driver.guincho?.modelo} - {driver.guincho?.marca}
                  </Text>
                  <Text style={styles.vehicleDetails}>
                    {driver.guincho?.ano} - {driver.guincho?.comprimento ?? 0}m x {safeFixed(driver.guincho?.capacidade)}m
                  </Text>
                </View>

                {selecting && (
                  <View style={styles.selectingOverlay}>
                    <ActivityIndicator size="small" color="#EF8108" />
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
      </View>
    </View>
  );
}

