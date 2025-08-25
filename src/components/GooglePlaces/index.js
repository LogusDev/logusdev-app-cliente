import React, { useState, useEffect } from 'react';
import {
  View,
  TextInput,
  FlatList,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import axios from 'axios';
import { Ionicons } from '@expo/vector-icons';
import Button from '../Button';
import { useNavigation } from '@react-navigation/native';
import { get } from 'react-native/Libraries/TurboModule/TurboModuleRegistry';
import TextInputComponent from '../TextInput';
import { getCurrentPositionAsync } from 'expo-location';

// Função para limpar sufixos indesejados dos endereços
function limparEndereco(endereco) {
  if (!endereco) return '';
  return endereco
    .replace(/\s*-\s*SP,\s*Brasil$/i, '')
    .replace(/\s*-\s*Brasil$/i, '')
    .replace(/\s*-\s*SP$/i, '');
}

const GOOGLE_API_KEY = 'AIzaSyAaHYGbfNa4N9Me-f2g8hlwahNYZLy5l0U';

export default function GooglePlaces({userLocation, onConfirm }) {
  const [origem, setOrigem] = useState('');
  const [destino, setDestino] = useState('');
  const [sugestoesOrigem, setSugestoesOrigem] = useState([]);
  const [sugestoesDestino, setSugestoesDestino] = useState([]);
  const [origemSelecionada, setOrigemSelecionada] = useState(null);
  const [destinoSelecionada, setDestinoSelecionada] = useState(null);
  const [loadingLocation, setLoadingLocation] = useState(false);

  const navigation = useNavigation();

  const buscarSugestoes = async (input, setSugestoes) => {
    if (input.length < 2) {
      setSugestoes([]);
      return;
    }

    try {
      const locationStr = userLocation
        ? `${userLocation.latitude},${userLocation.longitude}`
        : '-23.55052,-46.633308'; // fallback para São Paulo

      const { data } = await axios.get(
        'https://maps.googleapis.com/maps/api/place/autocomplete/json',
        {
          params: {
            input,
            key: GOOGLE_API_KEY,
            language: 'pt-BR',
            location: locationStr,
            radius: 10000,
            types: 'geocode',
          },
        }
      );

      if (data.status === 'OK') {
        const filtrados = data.predictions.filter((p) =>
          p.description.includes('São Paulo') ||
          p.description.includes('SP') ||
          p.description.includes('Itapecerica')
        );
        setSugestoes(filtrados);
      } else {
        setSugestoes([]);
      }
    } catch (err) {
      console.error('Erro ao buscar locais:', err.message);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => buscarSugestoes(origem, setSugestoesOrigem), 300);
    return () => clearTimeout(timer);
  }, [origem]);

  useEffect(() => {
    const timer = setTimeout(() => buscarSugestoes(destino, setSugestoesDestino), 300);
    return () => clearTimeout(timer);
  }, [destino]);

  const renderSugestoes = (sugestoes, onSelect) => (
    <FlatList
      data={sugestoes}
      keyExtractor={(item) => item.place_id}
      renderItem={({ item }) => (
        <TouchableOpacity style={styles.suggestionItem} onPress={() => onSelect(item)}>
          <Ionicons name="location-outline" size={20} color="#555" style={styles.icon} />
          <View style={styles.textContainer}>
            <Text style={styles.primaryText}>{item.structured_formatting.main_text}</Text>
            <Text style={styles.secondaryText}>{limparEndereco(item.structured_formatting.secondary_text)}</Text>
          </View>
        </TouchableOpacity>
      )}
      keyboardShouldPersistTaps="handled"
    />
  );

  const handleSelecionarOrigem = (item) => {
    setOrigem(limparEndereco(item.description));
    setSugestoesOrigem([]);
    setOrigemSelecionada(item);
  };

  const handleSelecionarDestino = (item) => {
    setDestino(limparEndereco(item.description));
    setSugestoesDestino([]);
    setDestinoSelecionada(item);
  };

  const getPlaceDetails = async (placeId) => {
    try {
      const response = await axios.get(
        'https://maps.googleapis.com/maps/api/place/details/json',
        {
          params: {
            place_id: placeId,
            key: GOOGLE_API_KEY,
          },
        }
      );

      const location = response.data.result.geometry.location;
      return {
        latitude: location.lat,
        longitude: location.lng,
      };
    } catch (error) {
      console.error('Erro ao buscar detalhes:', error);
      return null;
    }
  };

  // Em GooglePlaces.js

const confirmationRide = async () => {
    try {
        let origemFinal, destinoFinal;

        if (origemSelecionada.lat && origemSelecionada.lng) {
            origemFinal = {
                lat: origemSelecionada.lat,
                lng: origemSelecionada.lng,
                endereco: limparEndereco(origemSelecionada.endereco),
            };
        } else {
            const coords = await getPlaceDetails(origemSelecionada.place_id);
            if (!coords) throw new Error("Não foi possível obter as coordenadas da origem.");
            origemFinal = {
                lat: coords.latitude,
                lng: coords.longitude,
                endereco: limparEndereco(origemSelecionada.description),
            };
        }

        const destinoCoords = await getPlaceDetails(destinoSelecionada.place_id);
        if (!destinoCoords) throw new Error("Não foi possível obter as coordenadas do destino.");
        
        destinoFinal = {
            lat: destinoCoords.latitude,
            lng: destinoCoords.longitude,
            endereco: limparEndereco(destinoSelecionada.description),
        };
        console.log("Navegando com dados válidos:", { origem: origemFinal, destino: destinoFinal });

        navigation.navigate('CallConfirmation', {
            origem: origemFinal,
            destino: destinoFinal,
        });

    } catch (error) {
        console.error("Erro na confirmação da corrida:", error.message);
        alert("Ocorreu um erro ao confirmar os locais. Por favor, tente novamente.");
    }
  };

  async function handleUseCurrentLocation() {
    setLoadingLocation(true);
    try {
      const position = await getCurrentPositionAsync({});
      const { latitude, longitude } = position.coords;

      // Buscar endereço pelo reverse geocoding
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLE_API_KEY}`
      );
      const endereco = response.data.results[0]?.formatted_address || 'Localização atual';

      setOrigem(endereco);
      setOrigemSelecionada({
        endereco,
        lat: latitude,
        lng: longitude,
        titulo: 'Localização atual'
      });
    } catch (error) {
      alert('Não foi possível obter sua localização.');
    }
    setLoadingLocation(false);
  }

  return (
    <View style={styles.container}>
      {/* ORIGEM */}
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <TextInput
          style={[styles.input, { flex: 1, marginTop: 50 }]}
          placeholder="Local de origem"
          placeholderTextColor="#888"
          value={origem}
          onChangeText={(text) => {
            setOrigem(text);
            setOrigemSelecionada(null);
          }}
        />
        <TouchableOpacity
          style={{
            
            backgroundColor: '#F3F3F3',
            borderRadius: 20,
            padding: 6,
            justifyContent: 'center',
            alignItems: 'center',
            elevation: 2,
          }}
          onPress={handleUseCurrentLocation}
          disabled={loadingLocation}
        >
          <Ionicons name="locate" size={20} color="#EF8108" />
        </TouchableOpacity>
      </View>
      
      {sugestoesOrigem.length > 0 && (
        <View style={styles.suggestionsBox}>
          {renderSugestoes(sugestoesOrigem, handleSelecionarOrigem)}
        </View>
      )}

      {/* DESTINO */}
      <TextInput
        style={styles.input}
        placeholder="Destino"
        placeholderTextColor="#888"
        value={destino}
        onChangeText={(text) => {
          setDestino(text);
          setDestinoSelecionada(null);
        }}
      />
      {sugestoesDestino.length > 0 && (
        <View style={styles.suggestionsBox}>
          {renderSugestoes(sugestoesDestino, handleSelecionarDestino)}
        </View>
      )}

      {/* BOTÃO DE CONFIRMAR */}
      {origemSelecionada && destinoSelecionada && (
        <View style={{ justifyContent: "center", alignItems: "center" }}>
          <Button
            text="Confirmar"
            onPress={confirmationRide}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 30,
    backgroundColor: '#fff',
    flex: 1,
  },
  input: {
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#eaeaea',
    fontSize: 16,
    paddingHorizontal: 15,
    elevation: 3,
    marginTop: 50
  },
  suggestionsBox: {
    backgroundColor: '#fff',
    borderRadius: 15,
    marginTop: 5,
    paddingHorizontal: 10,
    paddingVertical: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 5,
    elevation: 4,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  icon: {
    marginRight: 10,
  },
  textContainer: {
    flex: 1,
  },
  primaryText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#222',
  },
  secondaryText: {
    fontSize: 14,
    color: '#777',
    marginTop: 2,
  },
  confirmButton: {
    marginTop: 30,
    backgroundColor: '#4CAF50',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  confirmText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
