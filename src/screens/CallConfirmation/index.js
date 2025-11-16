import React, { useRef, useEffect, useState, use } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { Ionicons } from "@expo/vector-icons";
import Button from "../../components/Button";
import styles from "./style";
import { UserContext } from "../../contexts/UserContext";
import { useContext } from "react";
import { getVehicles } from "../../services/services";
import IconOrigem from "../../components/IconOrigem";

export default function CallConfirmation({ route, navigation }) {
  const { origem, destino, veiculo } = route.params;
  const mapRef = useRef(null);
  const { user } = useContext(UserContext);
  const [actualVehicle, setActualVehicles] = useState();
  const [isLoading, setIsLoading] = useState(false);


  const fetchVehicles = async () => {
    try {
      const vehiclesArray = await getVehicles(user.id); 

      // 2. Verifica se a API retornou uma lista e se essa lista não está vazia
      if (vehiclesArray && Array.isArray(vehiclesArray) && vehiclesArray.length > 0) {
        // 3. Pega o primeiro objeto de veículo da lista
        const firstVehicle = vehiclesArray[0];
        console.log("Veículo obtido:", firstVehicle); 
        setActualVehicles(firstVehicle);
      } else {
        console.log("Nenhum veículo encontrado para o usuário logado.");
        setActualVehicles(null);
      }
    } catch (error) {
      console.error("Erro ao buscar veículos:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  const onMapReady = () => {
    if (mapRef.current && origem && destino) {
      mapRef.current.fitToCoordinates(
        [
          { latitude: origem.lat, longitude: origem.lng },
          { latitude: destino.lat, longitude: destino.lng },
        ],
        {
          edgePadding: { top: 100, right: 100, bottom: 100, left: 100 },
          animated: true,
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
        key={"AIzaSyBkx6mo29bFuoPzoNSLpE97c8EoWptHl1M"}
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
          <Ionicons
            name="map"
            size={24}
            color="#FFA500"
            style={styles.infoIcon}
          />
          <View style={styles.textContainer}>
            <Text style={styles.placeTitle}>
              <Text style={{ fontWeight: "bold" }}>
                {origem.titulo || origem.endereco.split("-")[0]}
              </Text>
            </Text>
            <Text style={styles.placeAddress}>
              {origem.endereco.split("-")[1]
                ? origem.endereco.split("-")[1].trim()
                : origem.endereco}
            </Text>
          </View>
        </View>

        {/* Linha de separação */}
        <View style={styles.separatorLine} />

        {/* Destino */}
        <View style={styles.infoItem}>
          <Ionicons
            name="location"
            size={24}
            color="#FFA500"
            style={styles.infoIcon}
          />
          <View style={styles.textContainer}>
            <Text style={styles.placeTitle}>
              <Text style={{ fontWeight: "bold" }}>
                {destino.titulo || destino.endereco.split("-")[0]}
              </Text>
            </Text>
            <Text style={styles.placeAddress}>
              {destino.endereco.split("-")[1]
                ? destino.endereco.split("-")[1].trim()
                : destino.endereco}
            </Text>
          </View>
        </View>

        {/* Linha de separação */}
        <View style={styles.separatorLine} />

        {/* Veículo */}
        <View style={styles.infoItem}>
          <Ionicons
            name="car-sport"
            size={24}
            color="#FFA500"
            style={styles.infoIcon}
          />
          <View style={styles.textContainer}>
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.placeTitle}>{actualVehicle?.modelo}</Text>
            )}
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.placeAddress}>
                {actualVehicle?.marca} • {actualVehicle?.ano_fabricacao}
              </Text>
            )}
          </View>
        </View>

        {/* Botão Confirmar */}
        {isLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Button
            text="Confirmar"
            onPress={() =>
              navigation.navigate("PaymentConfirmation", {
                origem,
                destino,
                actualVehicle,
              })
            }
          />
        )}
      </View>
    </View>
  );
}
