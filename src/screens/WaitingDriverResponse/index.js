import React, { useRef, useEffect, useState } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import { Video } from 'expo-av';
import Toast from 'react-native-toast-message';
import styles from './styles';
import IconOrigem from '../../components/IconOrigem';
import { getCallStatus } from '../../services/calls';
import { driverSearch } from '../../services/driver';
import { AppState } from 'react-native';
import SearchingVideo from '../../assets/images/searching.mp4';

export default function WaitingDriverResponse({ route, navigation }) {
  const { origem, destino, actualVehicle, callId, guincheiroInfo, selectedDriverId } = route.params;
  const [videoReady, setVideoReady] = useState(false);
  const [status, setStatus] = useState('aguardando'); 

  useEffect(() => {
    let cancelled = false;
    let delayMs = 2000;
    const appStateRef = { current: AppState.currentState };

    const onAppStateChange = (next) => {
      appStateRef.current = next;
    };
    const sub = AppState.addEventListener('change', onAppStateChange);
    let timer = null;

    const poll = async () => {
      if (cancelled) return;
      if (appStateRef.current !== 'active') {
        timer = setTimeout(poll, 2000);
        return;
      }
      try {
        const res = await getCallStatus(callId);
        console.log(`[WaitingDriverResponse] Status atual do chamado ${callId}:`, res?.status_chamado);
        console.log(`[WaitingDriverResponse] Guincheiro ID:`, res?.guincheiro_id);
        
        if (res?.status_chamado === 'em andamento' && res?.guincheiro_id === selectedDriverId) {
          cancelled = true;
          if (timer) clearTimeout(timer);
          
          console.log("✅ Guincheiro aceitou o chamado!");
          
          const driverData = await driverSearch(callId);
          const guincheiro = driverData?.guincheiro || guincheiroInfo;
          
          navigation.replace('CallProgress', {
            origem,
            destino,
            actualVehicle,
            callId,
            guincheiroInfo: guincheiro
          });
          return;
        }
        
        if (res?.guincheiro_id === null || res?.guincheiro_id !== selectedDriverId) {
          cancelled = true;
          if (timer) clearTimeout(timer);
          
          console.log("❌ Guincheiro recusou o chamado");
          Toast.show({
            type: 'error',
            text1: 'Guincheiro recusou',
            text2: 'O guincheiro escolhido recusou o chamado. Você pode escolher outro guincheiro.',
            position: 'bottom',
            visibilityTime: 3000,
            onPress: () => {
              navigation.replace('SelectDriver', {
                origem,
                destino,
                actualVehicle,
                callId
              });
            }
          });
          // Navega automaticamente após um delay
          setTimeout(() => {
            navigation.replace('SelectDriver', {
              origem,
              destino,
              actualVehicle,
              callId
            });
          }, 3000);
          return;
        }
        
        delayMs = Math.min(10000, Math.round(delayMs * 1.5));
      } catch (e) {
        console.error("[WaitingDriverResponse] Erro ao verificar status:", e);
        delayMs = Math.min(10000, Math.round(delayMs * 1.5));
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
  }, [callId, navigation, origem, destino, actualVehicle, selectedDriverId]);

  const onMapReady = () => {
  };

  return (
    <View style={styles.container}>
      <MapView
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

      <View style={styles.infoContainer}>
        <Text style={styles.sectionTitle}>Aguardando resposta do guincheiro...</Text>
        
        <View style={{ height: 200, width: 200, marginVertical: 20 }}>
          <Video
            source={SearchingVideo}
            style={{ height: '100%', width: '100%' }}
            resizeMode="cover"
            isLooping
            shouldPlay
            onLoad={() => setVideoReady(true)}
          />
        </View>

        {guincheiroInfo && (
          <View style={styles.driverInfo}>
            <Text style={styles.driverName}>{guincheiroInfo.nome}</Text>
            <Text style={styles.waitingText}>Aguardando confirmação...</Text>
          </View>
        )}

        <ActivityIndicator size="large" color="#EF8108" style={{ marginTop: 20 }} />
      </View>
    </View>
  );
}

