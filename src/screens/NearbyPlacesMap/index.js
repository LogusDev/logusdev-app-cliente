import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet, Image } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import axios from 'axios';
import * as Location from 'expo-location';
import MapViewDirections from 'react-native-maps-directions';
import { useNavigation } from '@react-navigation/native';
import Button from '../../components/Button';


const GOOGLE_API_KEY = 'AIzaSyBkx6mo29bFuoPzoNSLpE97c8EoWptHl1M';

export default function NearbyPlacesMap({ route }) {
    const { tipo } = route.params;
    const [locais, setLocais] = useState([]);
    const [userLocation, setUserLocation] = useState(null);
    const [destination, setDestination] = useState(null);
    const [showButton, setShowButton] = useState(false);

    const navigation = useNavigation();

    async function loadPlaces() {
        try {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') console.log("Erro, Permiissão negada")

            const position = await Location.getCurrentPositionAsync({});
            const { latitude, longitude } = position.coords;
            setUserLocation({ latitude, longitude });

            const keyword = tipo === "tyre_shop" ? "&keyword=tyre_shop" : "";

            const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=4000&type=${tipo === "tyre_shop" ? "car_repair" : tipo}${keyword}&key=${GOOGLE_API_KEY}`;

            const { data } = await axios.get(url);
            setLocais(data.results);

            console.log(data.status);
            console.log(data.results.length);
            
        } catch (error) {
            console.log("Erro, não foi possivel buscar endereços próximos")
        }
    }

    const mapStyle = [
        {
            featureType: "poi",
            stylers: [{ visibility: "off" }] //Serve pra tirar os outros estabelecimentos do mapa e não deixar muito poluído
        },
        {
            featureType: "poi.business",
            stylers: [{ visibility: "off" }]
        },
        {
            featureType: "poi.medical",
            stylers: [{ visibility: "off" }]
        },
        {
            featureType: "poi.place_of_worship",
            stylers: [{ visibility: "off" }]
        },
        {
            featureType: "poi.school",
            stylers: [{ visibility: "off" }]
        },
    ];

    useEffect(() => { loadPlaces(); }, []);

   

    if (!userLocation) {
        return (
            <View style={StyleSheet.center}>
                <ActivityIndicator size="large" color="#e60000"/>
            </View>
        );
    }

    function getIcon(tipo) {
        switch (tipo) {
            case 'gas_station':
                return require('../../assets/images/gas-station-icon.png')
            case 'car_repair':
                return require('../../assets/images/car-repair-icon.png')
            case 'auto_parts_store':
                return require('../../assets/images/auto-parts-icon.png')
            default:
                return require('../../assets/images/car-default-icon.png')
        }
    }

   return (
  <View style={{ flex: 1 }}>
    <MapView
      style={styles.map}
      customMapStyle={mapStyle}
      initialRegion={{
        latitude: userLocation.latitude,
        longitude: userLocation.longitude,
        latitudeDelta: 0.022,
        longitudeDelta: 0.012,
      }}
    >
      <Marker
        coordinate={userLocation}
        title="Você está aqui"
        pinColor="Orange"
      />
      {locais.map((item) => (
        <Marker
          key={item.place_id}
          coordinate={{
            latitude: item.geometry.location.lat,
            longitude: item.geometry.location.lng,
          }}
          title={item.name}
          description={item.vicinity}
          onPress={() => {
            setDestination(item)
            setShowButton(true)
          }}
        >
          <Image
            source={getIcon(tipo)}
            style={{ width: 50, height: 50 }}
            resizeMode="contain"
          />
        </Marker>
      ))}

      {destination && (
        <MapViewDirections
          origin={userLocation}
          destination={{
            latitude: destination.geometry.location.lat,
            longitude: destination.geometry.location.lng,
          }}
          apikey={GOOGLE_API_KEY}
          strokeWidth={4}
          strokeColor="#e68600ff"
          optimizeWaypoints={true}
        />
      )}
    </MapView>

    {showButton && destination && (
      <View style={styles.btnContainer}>
        <Button
          text="Iniciar Chamado"
          onPress={() => navigation.navigate('OriginDestiny', {
            userLocation,
            destinoLat: destination.geometry.location.lat,
            destinoLng: destination.geometry.location.lng,
            destinoNome: destination.name,
            destinoEndereco: destination.vicinity
          })}
        />
      </View>
    )}
  </View>
);
}

const styles = StyleSheet.create({
   map: { 
    flex: 1 
  },
  center: { 
    flex: 1, 
    justifyContent: "center", 
    alignItems: "center" 
  },

  btnContainer: {
  position: 'absolute',
  bottom: 20,
  width: '100%',
  alignItems: 'center'
}

});